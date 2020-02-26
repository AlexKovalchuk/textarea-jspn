import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import './JsonTextareaStyle.css';

interface ParentPropsItem {
    optionList: { title: string }[]
}

const JsonInput:FunctionComponent<ParentPropsItem> = props => {
    const {optionList} = props;
    // const [jsonArray, setJsonArray] = useState<Array<any>>([]);
    const [jsonText, setJsonText] = useState('unset');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [autocomplite, setAutocomplite] = useState([]);
    const [selection, setSelection] = useState(0);
    const textareaElementRef = useRef<HTMLTextAreaElement>(null);

    const changeCursorePosition = () => {
        if(textareaElementRef && textareaElementRef.current) {
            textareaElementRef.current.selectionStart = selection;
            textareaElementRef.current.selectionEnd = selection;
        }
    }

    const convertObjectToString = (data: object[] | object) => {
        return JSON.stringify(data, undefined, 2)
    }

    const checkIsOnlyLetters = (str: string): boolean => {
        const letters = /^[A-Za-z]+$/;
        if(str.match(letters)) return true
        else return false
    }

    useEffect(() => {
        changeCursorePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jsonText])

    useEffect(() => {
        // setJsonArray([...optionList]); // temporary commented
        setJsonText(convertObjectToString(optionList));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const textAreaOnChangeHandler = (element: React.FormEvent<HTMLTextAreaElement>): void => {
        const selectionStart = textareaElementRef.current!.selectionStart
        const newValue = element.currentTarget.value
        setSelection(selectionStart);
        setJsonText(newValue);
        findMatchesOptionsTitles(getLastTypedWord(selectionStart, newValue));
    }

    const getLastTypedWord = (selectionStart:  number, text: string): string => {
        const substringStart = text.substring(0, selectionStart).split(' ');
        // console.log('substringStart', substringStart);
        return substringStart[substringStart.length-1];
    }

    const findMatchesOptionsTitles = (text: string): object[] => {
        return  optionList.filter(option => option.title!.substring(0, text.length).toLowerCase() === text.toLowerCase());
    }

    const clearStringJson = (str: string): string => {
        return str.split(' ').reduce((accumulate:string, currentValue: string) => {
            if(!checkIsOnlyLetters(currentValue)) return accumulate += currentValue;
            return accumulate;
        });
    }

    const onKeyPressed = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            const { selectionStart, selectionEnd } = event.target as HTMLTextAreaElement;
            const substringTab = getLastTypedWord(selectionStart, jsonText);
            const findedTitles: {title: string} | undefined = optionList.find((option: {title: string}) => option.title === substringTab);
            if (findedTitles) setJsonText(convertObjectToString(JSON.parse(clearStringJson(jsonText.substring(0, selectionStart - findedTitles.title.length) + `${convertObjectToString(findedTitles)},` + jsonText.substring(selectionEnd)))));
            else setJsonText(jsonText.substring(0, selectionStart) + '  ' + jsonText.substring(selectionEnd));
            setSelection(selectionStart + 1);
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
                        onChange={textAreaOnChangeHandler}
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
