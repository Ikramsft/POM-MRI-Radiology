import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getNotes = createAsyncThunk('notesApp/notes/getNotes', async () => {
	const token = JSON.parse(localStorage.getItem('AUTH_TOKEN'));
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': token.idToken.jwtToken
	};
	const response = await axios.get(API_URL.GET_NOTES, {
		headers: headers
	  });
	const data = await response.data.data;
	return data;
});

export const createNote = createAsyncThunk('notesApp/notes/createNote', async note => {
	const headers = {
		'Content-Type': 'application/json'
	};
	const response = await axios.post(API_URL.CREATE_NOTE, note, {
		headers: headers
	  });
	const data = await response.data.data;
	return data;
});

export const updateNote = createAsyncThunk('notesApp/notes/updateNote', async note => {
	const headers = {
		'Content-Type': 'application/json'
	};
	const response = await axios.post(API_URL.UPDATE_NOTE, note, {
		headers: headers
	});
	const data = await response.data.data;

	return data;
});

export const removeNote = createAsyncThunk('notesApp/notes/removeNote', async noteId => {
	const response = await axios.post(API_URL.REMOVE_NOTE, { noteId });
	const data = await response.data.data;
	return data;
});

const notesAdapter = createEntityAdapter({});

export const {
	selectAll: selectNotes,
	selectEntities: selectNotesEntities,
	selectById: selectNoteById
} = notesAdapter.getSelectors(state => state.notesApp.notes);

const notesSlice = createSlice({
	name: 'notesApp/notes',
	initialState: notesAdapter.getInitialState({ searchText: '', noteDialogId: null, variateDescSize: true }),
	reducers: {
		setNotesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		resetNotesSearchText: (state, action) => {
			state.searchText = '';
		},
		toggleVariateDescSize: (state, action) => {
			state.variateDescSize = !state.variateDescSize;
		},
		openNoteDialog: (state, action) => {
			state.noteDialogId = action.payload;
		},
		closeNoteDialog: (state, action) => {
			state.noteDialogId = action.null;
		}
	},
	extraReducers: {
		[getNotes.fulfilled]: notesAdapter.setAll,
		[createNote.fulfilled]: notesAdapter.addOne,
		[updateNote.fulfilled]: notesAdapter.upsertOne,
		[removeNote.fulfilled]: notesAdapter.removeOne
	}
});

export const {
	setNotesSearchText,
	resetNotesSearchText,
	toggleVariateDescSize,
	openNoteDialog,
	closeNoteDialog
} = notesSlice.actions;

export default notesSlice.reducer;
