import React, { Component } from 'react';
import { connect } from 'react-redux';
import Title from './Title';
import Metadata from './Metadata';
import { metadataSelector } from '../selectors';
import { toggleEdit, toggleSave, undo, fetchData } from '../actions';

class Header extends Component {

    constructor(props) {
        super(props);
        this.toggleEditClicked = this.toggleEditClicked.bind(this);
        this.toggleSaveClicked = this.toggleSaveClicked.bind(this);
        this.undoClicked = this.undoClicked.bind(this);
    }

    toggleEditClicked() {
        this.props.dispatch(toggleEdit());
    }

    toggleSaveClicked() {
        this.props.dispatch(toggleSave());
    }

    undoClicked() {
        this.props.dispatch(undo());
        this.props.dispatch(fetchData());
    }

    render() {
        const { metadata, editable, mode, undoSize, dispatch } = this.props;
        const title = mode.length>0?mode+':'+metadata.get('title'):metadata.get('title');
        const icon = editable ? "fa-newspaper-o" : "fa-pencil";
        document.title = title;
        const saveButton = (
            <i className="fa fa-save" onClick={this.toggleSaveClicked}
                title="Export notebook">
            </i>
        );
        const undoButton = (
            <i className="fa fa-rotate-left" onClick={this.undoClicked} title="Undo">
            </i>
        );
        const lockButton = (
            <i className="fa fa-lock" onClick={this.toggleSaveClicked}
                title="Locked">
            </i>
        );
        const changesMade = editable && undoSize > 0;
        const editControls = (
            <span className="controls">
                {changesMade ? undoButton : null}
                {changesMade ? saveButton : null}
                <i className={'fa ' + icon} onClick={this.toggleEditClicked}
                    title={editable ? "Exit edit mode" : "Enter edit mode"}>
                </i>
            </span>
        );
        const sealedControls = (
            <span className="controls">
                <div style={{ width:"30px",height:"30px",border:"1px solid red",backgroundColor:"orange"}}></div>
            </span>
        );
        const controls = mode==='DEV' ? editControls : sealedControls;
        
        return (
            <div>
                <Title title={title} editable={editable} dispatch={dispatch} />
                {controls}
                <Metadata editable={editable} metadata={metadata} dispatch={dispatch} mode={mode} />
            </div>
        );
    }

}

export default connect(metadataSelector)(Header);
