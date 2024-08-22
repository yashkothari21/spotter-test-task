import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material'
import { FC } from 'react'

const ResetModal: FC<{
	handleClose: () => void
	handleSuccess: () => void
	open: boolean
}> = ({ handleClose, handleSuccess, open }) => {
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Reset Filters</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure to reset all applied table filter?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>No</Button>
				<Button onClick={handleSuccess}>Yes</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ResetModal
