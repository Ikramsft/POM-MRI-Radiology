import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import { useForm } from '@fuse/hooks';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import {useParams} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeVerificationSheetDialog,
	getVerificationSheetData,
	getIndexDetails
} from '../store/ProfileSlice';
import VerificationSheetContent from './VerificationSheetContent';

function VerificationSheetDialog(props) {
	const dispatch = useDispatch();
	const { id } = useParams();
	const verificationSheetDialog = useSelector(({ profilePageApp }) => profilePageApp.profile.verificationSheetDialog);
    const { form, handleChange, setForm } = useForm({});
	const [verificationData, setVerificationData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const initDialog = useCallback(async () => {
		if (verificationSheetDialog.data) {
			setForm({ ...verificationSheetDialog.data });
		}
	}, [verificationSheetDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (verificationSheetDialog.props.open) {
			initDialog();
		}
	}, [verificationSheetDialog.props.open, initDialog]);

	useEffect(() => {
		async function fetchVerificationSheetData() {
			setIsLoading(true);
			let result = await Promise.all(form.selectedRows.map(async (examId) => {
				const res = await dispatch(getVerificationSheetData({ exam_id: examId, p_id: id }));
				return res.payload.data;
			}));
			setVerificationData(result);
			setIsLoading(false);
		}
		if (form.selectedRows && form.selectedRows.length > 0) {
			fetchVerificationSheetData();
		}
	}, [form.selectedRows]);

	function closeComposeDialog() {
		dispatch(closeVerificationSheetDialog());
	}

	function handleSubmit(event) {
		event.preventDefault();
		var printContents = document.getElementById('printme').innerHTML;
		var w = document.getElementById('ifmcontentstoprint').contentWindow;
    	w.document.open();
		w.document.write('<html><head><title></title><style>* {color: #fff, font-family: Muli,Roboto,"Helvetica",Arial,sans-serif;} .w-1-2{width:50%;} .w-2-5{width:40%;} .w-3-5{width:60%;} .border-2{border:1px solid rgba(0, 0, 0, 0.12);} .border-l-2{border-left:1px solid rgba(0, 0, 0, 0.12);} .border-r-2{border-right:1px solid rgba(0, 0, 0, 0.12);} .border-b-2{border-bottom:1px solid rgba(0, 0, 0, 0.12);} .mb-24{margin-bottom:20px;} .mb-4{margin-bottom: 2px;} .pmb-4{margin-bottom: 5px;} .ml-8{margin-left: 5px;} .mr-4{margin-right: 4px;} .mr-20{margin-right: 10px;} .flex-col{flex-direction: column;} .w-full{width:100%;} .flex-1{flex: 1 1;} .flex{display:flex;} .mr-10{margin-right:10px;} input {outline: 0;border-width: 0 0 2px;border-color: black} img {display:none} .w-2-3{width:66%;} .w-1-3{width:33%;} .quest{margin-bottom: 5px;} .justify-center{justify-content:center} .justify-left{justify-content:left} .justify-right{justify-content:right} .logo-icon{display: flex;} .no-print{display:none;} .text-right{text-align: right;} .text-center{text-align: center;} .font-normal{font-size: 15px; font-family: Muli,Roboto,sans-serif} .font-bold{font-size: 20px; font-weight: bold; font-family: Muli,Roboto,sans-serif} @media print{ * {color: #000 } .MuiSvgIcon-root{display:none} .radio{height:15px;width:15px;display: flex;margin-right:50px} .print-card{padding-bottom: 10px; border-bottom: 1px solid #000} img {display:block; max-width: 100%}} .justify-around { justify-content: space-around;} .items-center { align-items: center;} .flex-col {flex-direction: column;}	.text-15 {font-size: 12px;line-height: 0.5;} .text-20 {font-size: 14px;line-height: 0.5;} .h6{font-size: 20px;} .break-word {overflow-wrap: break-word;display: inline-block; line-height:1.2em; margin-bottom:5px;} .page-break {display: block;page-break-before: always;position: relative;} 		</style></head><body>');
		w.document.write(printContents);
		w.document.write('</body></html>');
		w.print();
		w.close();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...verificationSheetDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<div className="md:flex max-w-2xl">
				<Card className="w-full mb-16 rounded-8">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Verification Sheet
							</Typography>
							<div className='p-8'>
								<IconButton disableRipple className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={handleSubmit}>
									<Icon>print</Icon>
								</IconButton>
							</div>
						</Toolbar>
					</AppBar>
					<CardContent style={{ overflowY: 'auto', height: 'calc(100vh - 150px)'}}>
					<iframe id="ifmcontentstoprint" style={{
                        height: '0px',
                        width: '0px',
                        position: 'absolute',
                    }}></iframe>
					<div id="printme">
						{isLoading && (
							<div className="flex flex-1 items-center justify-center h-full">
								<CircularStatic />
							</div>
						)}
						{verificationData && verificationData.map((verificationDetail, index) => (
							<>
								<VerificationSheetContent verificationDetail={verificationDetail}/>
								{(index + 1) !== verificationData.length && (
									<div className="page-break"></div>
								)}
							</>
						))}
					</div>
					</CardContent>
				</Card>
			</div>
		</Dialog>
	);
}

export default VerificationSheetDialog;
