import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import './JsonTextareaStyle.css';

const JsonInput:FunctionComponent<{}> = (props: any) => {
    const jsn={"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}
    const [jsonText, setJsonText] = useState('unset');
    const [selection, setSelection] = useState(0);
    let textareaElementRef = useRef<HTMLTextAreaElement>(null);

    const changeCursorePosition = () => {
        if(textareaElementRef && textareaElementRef.current) {
            const {selectionStart, selectionEnd,value} = textareaElementRef.current;
            console.log('selectionStart', selectionStart, 'selectionEnd', selectionEnd, 'value', value);
            textareaElementRef.current.selectionStart = selection;
            textareaElementRef.current.selectionEnd = selection;
        }
    }

    useEffect(() => {
        changeCursorePosition();
    }, [jsonText])

    useEffect(() => {
        // setJson(jsn);
        setJsonText(JSON.stringify(jsn, undefined, 2))
    }, [])

    const textAreaOnChangeHandler = (element: React.FormEvent<HTMLTextAreaElement>): void => {
        console.log('element', element.currentTarget.value);
        setJsonText(element.currentTarget.value);
    }
    
    const onKeyPressed = (event:  any): void => {
        console.log('textareaElementRef',textareaElementRef);
        
        // enableTab();
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            const { selectionStart, selectionEnd } = event.target
            // get caret position/selection
            
            let start = selectionStart;
            let end =selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            let value = jsonText.substring(0, start) + '\t' + jsonText.substring(end);
            
            // put caret at right position again
            setSelection(start+1);
            // save new value
            setJsonText(value);
            
            
        }
    }
   
    console.log('render');
    
    return (
        <div className="json-textarea-container">
            <h1>Input Json component</h1>
            <h1>{jsonText}</h1>
            <textarea 
                ref={textareaElementRef}
                rows={40} 
                cols={140} 
                className="json-textarea" 
                value={jsonText}
                tabIndex={0}
                onKeyDown={onKeyPressed}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) => textAreaOnChangeHandler(e)}
            />
        </div>
    )
}

export default JsonInput;
