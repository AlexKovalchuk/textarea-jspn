import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import './JsonTextareaStyle.css';

const JsonInput:FunctionComponent<{}> = (props: any) => {
    const jsn={"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}
    const [jsonText, setJsonText] = useState('unset');
    const [jsonArray, setJsonArray] = useState<Array<any>>([]);
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
        const arr = [];
        arr.push(jsn);
        setJsonArray(arr);
        setJsonText(JSON.stringify(arr, undefined, 2))
    }, [])

    const textAreaOnChangeHandler = (element: React.FormEvent<HTMLTextAreaElement>): void => {
        console.log('element', element.currentTarget.value);
        setSelection(textareaElementRef.current!.selectionStart);
        setJsonText(element.currentTarget.value);
    }
    
    const onKeyPressed = (event:  any): void => {
        // enableTab();
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            const { selectionStart, selectionEnd } = event.target
            let value = jsonText.substring(0, selectionStart) + '\t' + jsonText.substring(selectionEnd);
            setSelection(selectionStart + 1);
            setJsonText(value);            
        }
        // handle enter
        
        // handle backspace <- click
    }
   
    console.log('render');
    
    return (
        <div className="json-textarea-container">
            <h1>Input Json component</h1>
            <h1>{jsonText}</h1>
            <div className="json-textarea-block">
                <div className="block-one">
                    <textarea 
                        ref={textareaElementRef}
                        rows={40} 
                        cols={125} 
                        className="json-textarea" 
                        value={jsonText}
                        tabIndex={0}
                        onKeyDown={onKeyPressed}
                        onChange={(e: React.FormEvent<HTMLTextAreaElement>) => textAreaOnChangeHandler(e)}
                    />
                </div>
                <div className="block-two">
                    List...
                </div>
            </div>
        </div>
    )
}

export default JsonInput;
