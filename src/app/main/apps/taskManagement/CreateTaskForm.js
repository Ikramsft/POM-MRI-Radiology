
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import Button from '@material-ui/core/Button';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
// import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {addTaskManagementData,setResponseStatus} from './store/TaskManagementSlice';

const useStyles = makeStyles((theme) => ({
	root: {
		width: 400
	},
	button: {
		display: 'block',
		marginTop: theme.spacing(2),
		marginLeft: 25
	},
	formControl: {
		margin: theme.spacing(1),
		width: '100%'
	},
	boxPadding: {
		paddingHorizontal: 15
	},
	closeIcon: {
		position: 'absolute',
		right: '15px',
		top: '20px',
		color: 'grey',
		cursor: 'pointer'
	},
	button:{
		color: '#fff !important',
		margin: '10px 0px !important',
		padding: '6px 16px !important',
		borderRadius: '3px !important',
		backgroundColor: '#192d3e !important'
	}
}));

const CreateFormDialog = ({
	isOpen,
	handleCloseDialog,
	// modality,
	// data
}) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [taskName, setTaskName] = useState('')
	const classes = useStyles();
	const customeNotify = useCustomNotify();
	const [dataForm, setDataForm] = useState({
		taskName: '',
		});

	const handleClose = () => {
		handleCloseDialog(false)
	}
	// const StyleButton=  withStyles({
	// 	root:{
	// 		color:' #fff !important',
	// 		backgroundColor: '#192d3e !important',
	// 		padding:' 6px 16px !important',
	// 		borderRadius: '3px !important',
	// 		margin:'10px 0px !important'
	// 	}
	// })(Button);
	async function handleSubmit(event) {
		event.preventDefault()
		setLoading(true)
		const data = {
			key:'add',
			task: taskName,
		};
	   const result =await dispatch(addTaskManagementData(data))
	   if (result.isCreatedError !== true) {
		customeNotify("Task created successfully!", 'success')
		dispatch(setResponseStatus())
	}
	else {
		customeNotify("something went wrong!", 'error')
	} 
	setLoading(false)
	}
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">

			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
				<DialogTitle id="simple-dialog-title">Create a Task</DialogTitle>
				<ClearIcon onClick={handleClose} className={classes.closeIcon} />
				<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
					<DialogContent dividers className={classes.root}>
						<div className="flex">
							<TextField
								className="mb-5"
								autoFocus
								label="Task Name"
								name="task name"
								id="taskName"
								value={taskName}
								onChange={(e) => setTaskName(e.target.value)}
								variant="outlined"
								required
								fullWidth
								rows={4}
								multiline
								autoComplete='false'
								className={classes.formControl}
							/>
						</div>
					</DialogContent>


					<DialogActions className="justify-between p-8">
						<div>
						{/* <StyleButton> */}
							<Button
								
								color="primary"
								onClick={handleSubmit}
								type="submit"
								className={classes.button}
								disabled={loading}
							>
								Create
								{loading && <CircularProgress className="ml-10" size={18} />}
							</Button>
							{/* </StyleButton> */}
						</div>
					</DialogActions>

				</form>

			</Dialog>
		</div>
	);
};



export default CreateFormDialog;
