import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import './JsonTextareaStyle.css';
import {
    UP,
    DOWN,
    ACTIVE_OPTION_CLASS,
} from './constants';

interface ParentPropsItem {
    optionList: { title: string }[]
}

// here how work with useState array setTheArray(oldArray => [...oldArray, newElement]);

const JsonInput:FunctionComponent<ParentPropsItem> = props => {
    const {optionList} = props;
    const [autocompleteArray, setAutocompleteArray] = useState<{title: string}[]>([]);
    const [jsonText, setJsonText] = useState('unset');
    const [activeAutocompleteElementIndex, setActiveAutocompleteElementIndex] = useState(0);
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

    const checkIsOnlyLetters = (str: string): boolean => !!str.match(/^[A-Za-z]+$/);

    useEffect(() => {
        changeCursorePosition();
        if(!autocompleteArray.length) setActiveAutocompleteElementIndex(0) // clear selection if no autocomplite options there.
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
        const optionsForAutocomplete = findMatchesOptionsTitles(getLastTypedWord(selectionStart, newValue));
        setAutocompleteArray(optionsForAutocomplete);
    }

    const getLastTypedWord = (selectionStart:  number, text: string): string => {
        const substringStart = text.substring(0, selectionStart).split(' ');
        return substringStart[substringStart.length-1];
    }

    const checkPreviusComma = (selectionStart:  number, text: string): string => {
        const substringStart = text.substring(0, selectionStart).split(' ');
        for (let index = substringStart.length - 2; index >= 0; index--) {
            const element = substringStart[index];
            if(element) return element
        }
        return '';
    }

    const getFirstTypedWord = (selectionEnd:  number, text: string): string =>  {
        const subStringEnd = text.substring(selectionEnd).split(' ');
        // console.log('subStringEnd', subStringEnd);
        return subStringEnd[0];
    }

    const findMatchesOptionsTitles = (text: string): {title: string}[] => {
        if(!text) return [];
        return  optionList.filter(option => option.title!.substring(0, text.length).toLowerCase() === text.toLowerCase());
    }

    const clearStringJson = (str: string): string => {
        return str.split(' ').reduce((accumulate:string, currentValue: string) => {
            if(!checkIsOnlyLetters(currentValue)) return accumulate += currentValue;
            return accumulate;
        });
    }

    const changeActiveIndexAutocompleteElement = (typedAction: string): void => {
        // console.log(typedAction);
        const countOfAutocompleteTitles = autocompleteArray.length;
        if (typedAction === UP) {
            if(activeAutocompleteElementIndex === 1) setActiveAutocompleteElementIndex(countOfAutocompleteTitles);
            else setActiveAutocompleteElementIndex(activeAutocompleteElementIndex - 1)
        }

        if (typedAction === DOWN) {
            if(countOfAutocompleteTitles === activeAutocompleteElementIndex)   setActiveAutocompleteElementIndex(1);
            else setActiveAutocompleteElementIndex(activeAutocompleteElementIndex + 1)
        }
    }

    const insertNewObjectToStringData = (event: React.KeyboardEvent<HTMLTextAreaElement>, searchingText: string, findedObject: {}): void => {
        const { selectionStart, selectionEnd } = event.target as HTMLTextAreaElement;
        const textBefore = checkPreviusComma(selectionStart, jsonText);
        const textAfter = getFirstTypedWord(selectionEnd, jsonText);
        console.log('textBefore', textBefore);
        console.log('textAfter', textAfter);
        if(textBefore && textBefore.includes(',')){
            setJsonText(convertObjectToString(JSON.parse(clearStringJson(jsonText.substring(0, selectionStart - searchingText.length) + `${convertObjectToString(findedObject)},` + jsonText.substring(selectionEnd)))));
        } else if(textBefore && textBefore.includes('}')) {
            setJsonText(convertObjectToString(JSON.parse(clearStringJson(jsonText.substring(0, selectionStart - searchingText.length) + `,${convertObjectToString(findedObject)}` + jsonText.substring(selectionEnd)))));
        } else {
            setJsonText(convertObjectToString(JSON.parse(clearStringJson(jsonText.substring(0, selectionStart - searchingText.length) + `${convertObjectToString(findedObject)},` + jsonText.substring(selectionEnd)))));
        }
    };

    const onKeyPressed = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            const { selectionStart, selectionEnd } = event.target as HTMLTextAreaElement;
            const lastTypedWord = getLastTypedWord(selectionStart, jsonText);
            const selectedObject: {title: string} | undefined = optionList.find((option: {title: string}) => option.title === lastTypedWord);
            if (selectedObject) {
                insertNewObjectToStringData(event, lastTypedWord, selectedObject);
                setSelection(selectionStart);
            }
            else {
                setJsonText(jsonText.substring(0, selectionStart) + '  ' + jsonText.substring(selectionEnd));
                setSelection(selectionStart + 1)
            }
            setAutocompleteArray([]);
            setActiveAutocompleteElementIndex(0);
        }

        if (event.keyCode === 13) { // enter key pressed
            if (autocompleteArray.length) {
                const { selectionStart } = event.target as HTMLTextAreaElement;
                const selectedObject = autocompleteArray[activeAutocompleteElementIndex-1];
                const lastTypedWord = getLastTypedWord(selectionStart, jsonText);
                insertNewObjectToStringData(event, lastTypedWord, selectedObject);
                setAutocompleteArray([]);
                setActiveAutocompleteElementIndex(0);
            }
        }

        if (event.keyCode === 38) { // up key pressed
            if (autocompleteArray.length) {
                event.preventDefault();
                changeActiveIndexAutocompleteElement(UP);
            }
        }

        if (event.keyCode === 40) { // down key pressed
            if (autocompleteArray.length) {
                event.preventDefault();
                changeActiveIndexAutocompleteElement(DOWN);
            }
        }
    }

    const renderOptionList = () => {
        return optionList.map((option: { title: string }, index: number) => {
            return (
                <div key={`option-name-key-${index}`}>{option.title}</div>
            )
        });
    }

    const renderAutocompleteList = () => {
        return autocompleteArray.map((option: {title: string}, index: number) => {
            const {title} = option;
            const activeOption: string = activeAutocompleteElementIndex === index + 1 ? ACTIVE_OPTION_CLASS : '';
            return (
                <div
                    className={activeOption}
                    key={`autocomplete-item-${index}-${title}`}
                >
                    {title}
                    <input type="hidden" value={title} disabled={true} />
                </div>
            );
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
                    <div className="option-list-container">
                        <div>List...:</div>
                        {renderOptionList()}
                    </div>
                    <div className="option-autocomplete-container">
                        autocomlete will be here...
                        {renderAutocompleteList()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonInput;
