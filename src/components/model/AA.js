import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";

export default function AA({ setInputValueInParent, setMessageInParent, externalInputValue, triggerA2Action }) {
    const [inputValue, setInputValue] = useState("");

    // Pokreće akciju za A2 kada se triggerA2Action promeni
useEffect(() => {
    if (triggerA2Action) {
        handleButtonA2Click();
    }
}, [triggerA2Action]);


    // Reaguj na promene externalInputValue
    useEffect(() => {
        setInputValue(externalInputValue);
    }, [externalInputValue]);

    // Pokreće akciju za A2 kada se triggerA2Action promeni
    useEffect(() => {
        if (triggerA2Action) {
            handleButtonA2Click();
        }
    }, [triggerA2Action]);

    const handleButtonA2Click = () => {
        console.log("Akcija dugmeta A2");
        setMessageInParent("Akcija A2 pokrenuta");
    };

    const handleButtonB2Click = () => {
        setInputValueInParent(inputValue);
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Unesite vrednost..."
            />
            <Button onClick={handleButtonA2Click}>A2</Button>
            <Button onClick={handleButtonB2Click}>B2</Button>
        </div>
    );
}
