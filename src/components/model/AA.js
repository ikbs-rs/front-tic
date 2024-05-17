import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";

export default function AA({ updateInput, executeAction }) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (updateInput !== null) {
            setInputValue(updateInput);
        }
    }, [updateInput]);

    useEffect(() => {
        if (executeAction) {
            console.log("Akcija A2 pokrenuta");
        }
    }, [executeAction]);

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Unesite vrednost..."
            />
            <Button label="A2" onClick={() => console.log("Dugme A2 je kliknuto")}>A2</Button>
        </div>
    );
}
