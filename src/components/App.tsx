import * as React from 'react';
import JsonInput from './JsonInput/JsonTextarea';

const App = (props: any) => {

    const optionList = [
        {"id": 1, "title": "Alex", "email": 'Alex@gmail.com'},
        {id: 2, title: "Oscar", email: 'Oscar@gmail.com'},
        {id: 3, title: "Songo", email: 'Songo@gmail.com'},
        {id: 4, title: "Vegeta", email: 'Vegeta@gmail.com'},
        {id: 5, title: "Barrera", email: 'Barrera@gmail.com'},
        {id: 6, title: "Vasya", email: 'Vasya@gmail.com'},
        {id: 7, title: "Gozilla", email: 'Gozilla@gmail.com'},
        {id: 8, title: "Zero", email: "Zero@gmail.com", "glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}},
        {"id": 9, "title": "Alex", "email": 'Alex2@gmail.com'},
    ]
    return (
        <div className="home-page-container">
            <JsonInput optionList={optionList} />
        </div>
    )
}

export default App;
