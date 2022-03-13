import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'

export const Boolean = ({ value }: { value: boolean }) =>
    value ? <DoneIcon /> : <CloseIcon />
