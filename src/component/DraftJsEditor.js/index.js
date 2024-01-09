import React, { useState, useRef, useCallback } from "react";
import { Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import '../../screen/BulkImported/draft.css'
import '../../screen/BulkImported/example.css'
import '../../screen/BulkImported/rich-editor.css'
const DraftJsEditor = ({refrencevariable,editorState,setEditorState}) => {
    
    const focus = () => {
        if (refrencevariable.current) refrencevariable.current.focus();
    };

    const handleKeyCommand = useCallback(
        (command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                setEditorState(newState);
                return 'handled';
            }
            return 'not-handled';
        },
        [editorState, setEditorState],
    );

    const mapKeyToEditorCommand = useCallback(
        e => {
            switch (e.keyCode) {

                case 9: // TAB
                    const newEditorState = RichUtils.onTab(
                        e,
                        editorState,
                        4 /* maxDepth */,
                    );
                    if (newEditorState !== editorState) {
                        setEditorState(newEditorState);
                    }
                    return null;
            }
            return getDefaultKeyBinding(e);
        },
        [editorState, setEditorState],
    );

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (
            contentState
                .getBlockMap()
                .first()
                .getType() !== 'unstyled'
        ) {
            className += ' RichEditor-hidePlaceholder';
        }
    }
    return (
            <div className="RichEditor-root">
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={blockType => {
                        const newState = RichUtils.toggleBlockType(editorState, blockType);
                        setEditorState(newState);
                    }}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={inlineStyle => {
                        const newState = RichUtils.toggleInlineStyle(
                            editorState,
                            inlineStyle,
                        );
                        setEditorState(newState);
                    }}
                />
                <div className={className} onClick={focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={mapKeyToEditorCommand}
                        onChange={setEditorState}
                        placeholder="Write something..."
                        ref={refrencevariable}
                        spellCheck={true}
                    />
                </div>

            </div>
        

    )
}

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}

function StyleButton({ onToggle, active, label, style }) {
    let className = 'RichEditor-styleButton';
    if (active) {
        className += ' RichEditor-activeButton';
    }

    return (
        <span
            className={className}
            onMouseDown={e => {
                e.preventDefault();
                onToggle(style);
            }}>
            {label}
        </span>
    );
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

function BlockStyleControls({ editorState, onToggle }) {
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

function InlineStyleControls({ editorState, onToggle }) {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}

export default DraftJsEditor