import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import ResponsiveAppBar from '../../../components/header/ResponsiveAppBar';
import { CampoAberto } from '../../../components/input/CampoAberto';
import CarrinhoMateriaisDrawer from '../../../components/material/CarrinhoMateriaisDrawer';
import { MaterialCard } from '../../../components/material/MaterialCard';
import { MaterialCategoriaCard } from '../../../components/material/MaterialCatergoriaCard';
import { mockMaterialsService } from '../../../service/api';
import '../../../styles/home/Home.css';
import '../../../styles/materiais/MateriaisCategoria.css';
import { appBarSxMaterialCategoria } from '../../../styles/sx/AppBar';
import type { FiltroMaterialType } from '../../../types/filtro/filtroType';
import type { MaterialCategoriaDTO, MaterialVisualizacaoDTO } from '../../../types/material/materialType';

export default function MateriaisCategoria() {
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth >= 900);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [textoBusca, setTextoBusca] = useState<string>('');
  const [conteudoBusca, setConteudoBusca] = useState<MaterialCategoriaDTO[]>([]);
  const [materiaisFiltrados, setMateriaisFiltrados] = useState<MaterialVisualizacaoDTO[]>([]);
  const [materiaisFiltradosExibidos, setMateriaisFiltradosExibidos] = useState<MaterialVisualizacaoDTO[]>([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<MaterialVisualizacaoDTO[]>([]);
  const [filtro, setFiltro] = useState<FiltroMaterialType[]>([]);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<Record<string, string[]>>({});
  const [modoVisualizacao, setModoVisualizacao] = useState<'categorias' | 'materiais'>('categorias');

  useEffect(() => {
    function handleResize() {
      setDrawerOpen(window.innerWidth >= 900);
    }
    buscarMateriais();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrar materiais com base no texto de busca
  useEffect(() => {
    if (modoVisualizacao === 'materiais') {
      if (textoBusca.trim() === '') {
        setMateriaisFiltradosExibidos(materiaisFiltrados);
      } else {
        const textoBuscaLower = textoBusca.toLowerCase();
        const materiaisFiltradosPorBusca = materiaisFiltrados.filter(material =>
          material.materialName.toLowerCase().includes(textoBuscaLower) ||
          material.materialType.toLowerCase().includes(textoBuscaLower) ||
          material.materialTypeFamily.toLowerCase().includes(textoBuscaLower)
        );
        setMateriaisFiltradosExibidos(materiaisFiltradosPorBusca);
      }
    }
  }, [textoBusca, materiaisFiltrados, modoVisualizacao]);

  const isMobile = window.innerWidth < 900;

  const buscarMateriais = async () => {
    try {
      const result = await mockMaterialsService.getMaterialCategorias();
      console.log('Categorias de materiais buscadas:', result);
      setConteudoBusca(result);
      montarFiltroDinamico(result);
    } catch (error) {
      console.error('Erro ao buscar categorias de materiais:', error);
    }
  }

  const montarFiltroDinamico = (materiais: MaterialCategoriaDTO[]) => {
    const tipoProduto = Array.from(new Set(materiais.map(mat => mat.tipoMaterial)));
    const aplicacao = Array.from(new Set(materiais.map(mat => mat.tipoProduto)));
    const tipoFamiliaMaterial = Array.from(new Set(materiais.map(mat => mat.tipoFamiliaMaterial)));
    const filtrosDinamicos: FiltroMaterialType[] = [
      {
        nome: 'Tipo de Material',
        opcoes: tipoProduto.filter(Boolean)
      },
      {
        nome: 'Tipo de Produto',
        opcoes: aplicacao.filter(Boolean)
      },
      {
        nome: 'Tipo de Família do Material',
        opcoes: tipoFamiliaMaterial.filter(Boolean)
      }
    ];
    console.log(tipoFamiliaMaterial.filter(Boolean))
    setFiltro(filtrosDinamicos);
  }

  const handleCheckboxChange = (nomeFiltro: string, opcao: string, checked: boolean) => {
    setFiltrosSelecionados(prev => {
      const filtroAtual = prev[nomeFiltro] || [];

      if (checked) {
        // Adiciona a opção se marcada
        return { ...prev, [nomeFiltro]: [...filtroAtual, opcao] };
      } else {
        // Remove a opção se desmarcada
        return { ...prev, [nomeFiltro]: filtroAtual.filter(o => o !== opcao) };
      }
    });
  }

  const aplicarFiltros = async () => {
    // Verifica se há pelo menos um filtro selecionado
    const temFiltrosSelecionados = Object.values(filtrosSelecionados).some(
      valores => valores.length > 0
    );

    if (!temFiltrosSelecionados) {
      alert('Por favor, selecione pelo menos um filtro.');
      return;
    }

    try {
      let materiaisResultado: MaterialVisualizacaoDTO[] = [];

      // 1. Busca materiais por "Tipo de Material" (se houver)
      const tiposMaterialSelecionados = filtrosSelecionados['Tipo de Material'] || [];
      if (tiposMaterialSelecionados.length > 0) {
        const promessas = tiposMaterialSelecionados.map(tipo =>
          mockMaterialsService.getMaterialsByCategory(tipo)
        );
        const resultados = await Promise.all(promessas);
        materiaisResultado = resultados.flat();
      }

      // 2. Busca materiais por "Tipo de Produto" (se houver)
      const tiposProdutoSelecionados = filtrosSelecionados['Tipo de Produto'] || [];
      if (tiposProdutoSelecionados.length > 0) {
        const promessas = tiposProdutoSelecionados.map(tipo =>
          mockMaterialsService.getMaterialsByTipoProduto(tipo)
        );
        const resultados = await Promise.all(promessas);
        const materiaisPorProduto = resultados.flat();
        // Se já tem materiais de outro filtro, faz interseção (AND)
        // Se não tem, usa os materiais encontrados
        if (materiaisResultado.length > 0) {
          materiaisResultado = materiaisResultado.filter(mat =>
            materiaisPorProduto.some(mp => mp.materialName === mat.materialName)
          );
        } else {
          materiaisResultado = materiaisPorProduto;
        }
      }

      // 3. Busca materiais por "Tipo de Família do Material" (se houver)
      const tiposFamiliaSelecionados = filtrosSelecionados['Tipo de Família do Material'] || [];
      if (tiposFamiliaSelecionados.length > 0) {
        const promessas = tiposFamiliaSelecionados.map(tipo =>
          mockMaterialsService.getMaterialsByTipoFamilia(tipo)
        );
        const resultados = await Promise.all(promessas);
        const materiaisPorFamilia = resultados.flat();
        // Se já tem materiais de outro filtro, faz interseção (AND)
        // Se não tem, usa os materiais encontrados
        if (materiaisResultado.length > 0) {
          materiaisResultado = materiaisResultado.filter(mat =>
            materiaisPorFamilia.some(mf => mf.materialName === mat.materialName)
          );
        } else {
          materiaisResultado = materiaisPorFamilia;
        }
      }

      console.log('Materiais filtrados:', materiaisResultado);
      console.log('Filtros aplicados:', filtrosSelecionados);

      setMateriaisFiltrados(materiaisResultado);
      setMateriaisFiltradosExibidos(materiaisResultado);
      setModoVisualizacao('materiais');
      setTextoBusca(''); // Limpar busca ao aplicar novos filtros
    } catch (error) {
      console.error('Erro ao buscar materiais filtrados:', error);
      alert('Erro ao aplicar filtros. Tente novamente.');
    }
  }

  const limparFiltros = () => {
    setFiltrosSelecionados({});
    setMateriaisFiltrados([]);
    setMateriaisFiltradosExibidos([]);
    setTextoBusca('');
    setModoVisualizacao('categorias');
  }

  const adicionarMaterialAoCarrinho = (material: MaterialVisualizacaoDTO) => {
    // Verifica se o material já está no carrinho
    const jaExiste = materiaisSelecionados.some(m => m.id === material.id);

    if (!jaExiste) {
      setMateriaisSelecionados(prev => [...prev, material]);
    }
  }

  const removerMaterialDoCarrinho = (materialId: number) => {
    setMateriaisSelecionados(prev => prev.filter(m => m.id !== materialId));
  }

  const handleAdicionarAoProjeto = (projetoId: number, materiais: MaterialVisualizacaoDTO[]) => {
    // Aqui você pode implementar a lógica para adicionar ao projeto via API
    console.log('Materiais selecionados para adicionar ao projeto:', materiais);
    console.log('Projeto selecionado:', projetoId);
    alert(`${materiais.length} materiais serão adicionados ao projeto ${projetoId}!`);

    // Limpar carrinho após adicionar
    setMateriaisSelecionados([]);
    setCartDrawerOpen(false);
  }

  const verMateriaisPorCategoria = async (tipoMaterial: string) => {
    try {
      // Busca materiais da categoria selecionada
      const materiaisResultado = await mockMaterialsService.getMaterialsByCategory(tipoMaterial);

      console.log('Materiais da categoria:', materiaisResultado);
      console.log('Categoria selecionada:', tipoMaterial);

      // Atualiza os filtros selecionados para refletir a categoria
      setFiltrosSelecionados({
        'Tipo de Material': [tipoMaterial]
      });

      setMateriaisFiltrados(materiaisResultado);
      setMateriaisFiltradosExibidos(materiaisResultado);
      setTextoBusca(''); // Limpar busca ao selecionar categoria
      setModoVisualizacao('materiais');
    } catch (error) {
      console.error('Erro ao buscar materiais da categoria:', error);
      alert('Erro ao carregar materiais. Tente novamente.');
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />

      <Box
        className="materiais-categoria-container"
        sx={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - 64px)', // Altura total menos o AppBar
          overflow: 'hidden'
        }}
      >
        {isMobile && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1201 }}
            color="primary"
          >
            <MenuIcon />
          </IconButton>
        )}

        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 260,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 260,
              boxSizing: 'border-box',
              padding: '32px 18px 18px 18px',
              background: '#fff',
              borderRight: '1px solid #e0e0e0',
              position: 'relative',
              height: '100%',
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{ color: '#388e3c', mb: '1.2em', fontSize: '1.2em' }}
            >
              Filtros
            </Typography>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(false)} color="primary">
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {filtro.map((filtroItem) => (
            <Accordion key={filtroItem.nome} defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">{filtroItem.nome}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {filtroItem.opcoes.map((opcao) => (
                    <FormControlLabel
                      key={opcao}
                      control={
                        <Checkbox
                          checked={(filtrosSelecionados[filtroItem.nome] || []).includes(opcao)}
                          onChange={(e) => handleCheckboxChange(filtroItem.nome, opcao, e.target.checked)}
                        />
                      }
                      label={opcao}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            className="filtro-aplicar"
            variant="contained"
            color="success"
            sx={{ mt: 2, mb: 1, width: '100%' }}
            onClick={aplicarFiltros}
          >
            Aplicar Filtros
          </Button>
          <Button
            className="filtro-limpar"
            variant="outlined"
            color="success"
            sx={{ mb: 2, width: '100%' }}
            onClick={limparFiltros}
          >
            Limpar Filtros
          </Button>
        </Drawer>

        {/* Área principal com scroll */}
        <Box
          component="main"
          className="materiais-main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {/* Header da página de materiais */}
          <Box
            className="materiais-header"
            sx={{
              backgroundColor: '#fff',
              borderBottom: '1px solid #e0e0e0',
              padding: '16px 24px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h5" component="span" sx={{ color: 'var(--verde-escuro)' }}>
              {modoVisualizacao === 'categorias' ? (
                <>Categoria: <b>Subestrutura</b></>
              ) : (
                <>Materiais Filtrados: <b>{materiaisFiltradosExibidos.length} encontrados</b></>
              )}
            </Typography>
            <CampoAberto
              label="Pesquisar material"
              value={textoBusca}
              onChange={(e) => setTextoBusca(e.target.value)}
              placeholder="Ex: Bloco Ecológico, Cimento Verde..."
            />
          </Box>

          <Box
            className="materiais-grid"
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
            }}
          >
            {modoVisualizacao === 'categorias' ? (
              // Exibe cards de categorias
              conteudoBusca.map((mat) => (
                <MaterialCategoriaCard
                  key={mat.tipoMaterial}
                  {...mat}
                  onVerMateriais={verMateriaisPorCategoria}
                />
              ))
            ) : (
              // Exibe cards de materiais filtrados
              materiaisFiltradosExibidos.map((mat, index) => (
                <MaterialCard
                  key={`${mat.materialName}-${index}`}
                  {...mat}
                  onAddToCart={() => adicionarMaterialAoCarrinho(mat)}
                />
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Floating Action Button - Carrinho */}
      {modoVisualizacao === 'materiais' && materiaisFiltrados.length > 0 && (
        <Fab
          color="success"
          aria-label="carrinho de materiais"
          onClick={() => setCartDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
        >
          <Badge badgeContent={materiaisSelecionados.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}

      {/* Drawer do Carrinho de Materiais */}
      <CarrinhoMateriaisDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        materiaisSelecionados={materiaisSelecionados}
        onRemoverMaterial={removerMaterialDoCarrinho}
        onAdicionarAoProjeto={handleAdicionarAoProjeto}
      />
    </Box>
  );
}