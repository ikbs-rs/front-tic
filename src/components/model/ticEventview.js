import React, { useState, useEffect } from "react";
import { TicEventService } from '../../service/model/TicEventService';

export default function TicEventView({ eventData }) {
    console.log(eventData, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const [ticEventView, setTicEventView] = useState(null);

    useEffect(() => {
        async function fetchData() {
            if (!eventData?.event) return; // Ako nema ID, ne šalji upit
            
            try {
                const ticEventService = new TicEventService();
                const data = await ticEventService.getEventView(eventData.event, 'SHORT');
                setTicEventView(data.slika); // Čuvamo HTML string
            } catch (error) {
                console.error("Greška pri učitavanju eventView:", error);
            }
        }

        fetchData();
    }, [eventData]); // Dodali smo `eventData` kao dependency

    return (
        <div style={{ padding: "20px" }}>
            {ticEventView ? (
                <div dangerouslySetInnerHTML={{ __html: ticEventView }} />
            ) : (
                <p>Učitavanje...</p>
            )}
        </div>
    );
}
