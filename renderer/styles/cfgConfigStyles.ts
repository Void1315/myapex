import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles'

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
      marginBottom: theme.spacing(4)
    },
    childCfgItem: {
      borderBottom: '1px solid #999',
      paddingBottom: 8,
    },
    childCfgFormItemBox: {
      // width: '100%'
      borderBottom: '1px solid #BBBBBB',
      paddingBottom: 8,
    },
    childCfgTitle: {
      color: '#101010',
      fontSize: '24px',
      fontWeight: 'bold',
      cursor: 'default',
    }
  })
);
