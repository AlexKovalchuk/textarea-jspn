import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import './JsonTextareaStyle.css';

interface ParentStateItem {
    optionList: Array<object>
}

const JsonInput:FunctionComponent<ParentStateItem> = (props: any) => {
    const {optionList} = props;
    const [jsonText, setJsonText] = useState('unset');
    // const [jsonArray, setJsonArray] = useState<Array<any>>([]);
    const [selection, setSelection] = useState(0);
    let textareaElementRef = useRef<HTMLTextAreaElement>(null);

    const changeCursorePosition = () => {
        if(textareaElementRef && textareaElementRef.current) {
            textareaElementRef.current.selectionStart = selection;
            textareaElementRef.current.selectionEnd = selection;
        }
    }

    const convertObjectToString = (data: any) => {
        return JSON.stringify(data, undefined, 2)
    }

    useEffect(() => {
        changeCursorePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jsonText])

    useEffect(() => {
        const arr = [];
        arr.push(optionList);
        // setJsonArray([...optionList]);
        // setJsonText(JSON.stringify(optionList, undefined, 2));
        setJsonText(convertObjectToString(optionList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const textAreaOnChangeHandler = (element: React.FormEvent<HTMLTextAreaElement>): void => {
        setSelection(textareaElementRef.current!.selectionStart);
        setJsonText(element.currentTarget.value);
    }
    
    const onKeyPressed = (event:  any): void => {
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            let value = '';
            const { selectionStart, selectionEnd } = event.target
            const substringStart = jsonText.substring(0, selectionStart).split(' ');
            const substringTab = substringStart[substringStart.length-1];
            const findedTitles: Array<any> = optionList.filter((option: { title: React.ReactNode }) => option.title === substringTab)
            if(findedTitles && findedTitles.length) {
                value = jsonText.substring(0, selectionStart - findedTitles[0].title.length) + `${convertObjectToString(findedTitles[0])},` + jsonText.substring(selectionEnd);
                setJsonText(convertObjectToString(JSON.parse(value)));   
            }
            else {
                value = jsonText.substring(0, selectionStart) + '  ' + jsonText.substring(selectionEnd);
                setJsonText(value); 
            }
            
            console.log('value', convertObjectToString(JSON.parse(value)));
            
            setSelection(selectionStart + 1);
            // setJsonText(value); 
        }
    }

    const renderOptionList = () => {
        return optionList.map((option: { title: React.ReactNode; }, index:number) => {
            return (
                <div key={`option-name-key-${index}`}>{option.title}</div>
            )
        });
    }
    
    return (
        <div className="json-textarea-container">
            <h1>Input Json component</h1>
            <div>{jsonText}</div>
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
                    {renderOptionList()}
                </div>
            </div>
        </div>
    )
}

export default JsonInput;
