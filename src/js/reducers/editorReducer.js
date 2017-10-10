import Immutable from 'immutable';
import {
    TOGGLE_EDIT, TOGGLE_SAVE, EDIT_BLOCK
} from '../actions';
import { notebookMode } from '../config';


/*
 * This reducer simply keeps track of the state of the editor.
 */
const defaultEditor = Immutable.Map({
    editable: false,
    saving: false,
    activeBlock: null,
    mode: Immutable.fromJS(notebookMode||'')
});

export default function editor(state = defaultEditor, action) {
    switch (action.type) {
        case TOGGLE_EDIT:
            return state.set('editable', !state.get('editable'));
        case TOGGLE_SAVE:
            return state.set('saving', !state.get('saving'));
        case EDIT_BLOCK:
            return state.set('activeBlock', action.id);
        default:
            return state;
    }
}
