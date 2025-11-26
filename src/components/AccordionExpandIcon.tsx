import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import type { ReactNode } from 'react';
import { Colors } from '../styles/Colors';


type AccordionExpandIconProps = {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}

export default function AccordionExpandIcon(props: AccordionExpandIconProps) {
  return (
    <Accordion sx={{ width: '90%' }}>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography sx={{ fontWeight: 'bold', color: Colors.verdeBioEdifica }}>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {props.subTitle}
        </Typography>
        {props.children}
      </AccordionDetails>
    </Accordion>

  );
}