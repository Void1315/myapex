import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles'

export default makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: 'center',
            paddingTop: theme.spacing(4),
        },
    })
);
