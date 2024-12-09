import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TicDocsdiscountService } from "../../service/model/TicDocsdiscountService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Toast } from "primereact/toast";
import { translations } from "../../configs/translations";
import { TicDocService } from "../../service/model/TicDocService";
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import Token from "../../utilities/Token";

export default function TicDocsdiscountL(props) {
    // console.log(props, "^^-TicDocsdiscountProdajaL-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    const objName = "tic_docsdiscount";
    const toast = useRef(null);
    const emptyTicDocsdiscount = EmptyEntities[objName];

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticDocsdiscounts, setTicDocsdiscounts] = useState([]);
    const [_ticDocsdiscounts, set_ticDocsdiscounts] = useState([]);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);

    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValues, setSelectedValues] = useState({});
    const [activeStates, setActiveStates] = useState({});
    const [highlightedId, setHighlightedId] = useState(null);

    let [refresh, setRefresh] = useState(0);
    const [uniqueDocs, setUniqueDocs] = useState([]);

    const [showDiscount, setShowDiscount] = useState(false);
    const [discountRefresh, setDiscountRefresh] = useState(0)
    const [ticTpItems, setTicTpItems] = useState(null);
    const [ticTpItem, setTicTpItem] = useState(null);
    const [ddTicTpItems, setDdTicTpItems] = useState(null);
    const [ddTicTpItem, setDdTicTpItem] = useState(null);
    const [ticDocdiscountItems, setTicDocdiscountItems] = useState(null);
    const [ddTicDocdiscountItem, setDdTicDocdiscountItem] = useState(null);
    const [ddTicDocdiscountItems, setDdTicDocdiscountItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                // console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", props.item)
                const ticDocsdiscountService = new TicDocsdiscountService();
                const data = await ticDocsdiscountService.getTicDocsdiscountListaP(props.item.docs, abortController.signal);

                const dataTp = await ticDocsdiscountService.getDiscounttpListaP(props.item.docs, abortController.signal);
                setTicTpItems(dataTp)

                const dataDD = dataTp.map(({ nprivilige, id }) => ({ name: nprivilige, code: id }));
                setDdTicTpItems(dataDD);

                const updatedData = data.map(item => {
                    const matchedTpItem = dataDD.find(ddItem => ddItem.code === item.discount);
                    return {
                        ...item,
                        ddTicTpItem: matchedTpItem || null
                    };
                });

                setTicDocsdiscounts(updatedData);
                set_ticDocsdiscounts(updatedData);

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.item?.id, refresh, props.discountRefresh, discountRefresh]);

    //     useEffect(() => {
    //         const fetchAllParsMessage = async () => {
    //             try {
    //                 const tokenLocal = await Token.getTokensLS();


    //                 const worker = new Worker(new URL('../../workers/docuidWorker.js', import.meta.url));

    //                 worker.onmessage = (e) => {
    //                     const { action, result } = e.data;
    //                     console.log("AAAAAAAAAAAAA##########################:", result);

    //                     if (action === 'setTicDocsdiscounts') {
    //                         setTicDocsdiscounts(result);
    //                         set_ticDocsdiscounts(result);
    //                     }
    //                 };

    //                 worker.postMessage({
    //                     action: 'fetchTicDocsdiscountData',
    //                     data: { docsId: props.item.docs, selectedLanguage: selectedLanguage, token: tokenLocal.token, refreshToken: tokenLocal.refreshToken }
    //                 });

    //                 return () => worker.terminate(); // Clean up the worker when component unmounts
    //             } catch (error) {
    //                 console.error('Error fetching token:', error);
    //             }
    //         };

    //         fetchAllParsMessage();
    // }, [props.item?.id, refresh, props.discountRefresh, discountRefresh]);

    /**************************************************************************************** */


    const handleDelete = async (item, e) => {
        e.preventDefault(); // Prevent default action if necessary
        const ticDocsdiscountService = new TicDocsdiscountService();
        await ticDocsdiscountService.deleteTicDocsdiscount(item);
        setDiscountRefresh(prev => prev + 1);
        props.setRefresh(prev => prev + 1)
        setHighlightedId(item.id);
    };

    const handleUpdateClick = async (item, e) => {
        e.preventDefault();
        const ticDocsdiscountService = new TicDocsdiscountService();
        await ticDocsdiscountService.putTicDocsdiscount(item);
        // setDiscountRefresh(prev => prev + 1);   
        props.setRefresh(prev => prev + 1)
        setHighlightedId(item.id);
    };

    const handleCreateAllClick = async (item, e) => {
        e.preventDefault();
        // console.log(item, "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
        const ticDocsdiscountService = new TicDocsdiscountService();
        await ticDocsdiscountService.postTicDocsdiscountAll(item);
        setTimeout(() => {
            setDiscountRefresh(prev => prev + 1);
            setRefresh(prev => prev + 1)
            props.setRefresh(prev => prev + 1)
            props.handleAllRefresh()
            setHighlightedId(item.id);
        }, 1000);

    };

    const onInputChangeL = (e, field, itemId, item) => {

        const index = ticDocsdiscounts.findIndex((row) => row.id === item.id);
        if (index !== -1) {
            const updatedTicDocsdiscounts = [...ticDocsdiscounts];

            updatedTicDocsdiscounts[index] = {
                ...updatedTicDocsdiscounts[index],
                [field]: e.target.value
            };

            setTicDocsdiscounts(updatedTicDocsdiscounts);
            console.log(updatedTicDocsdiscounts[index][field], index, field, '333333333333333333333333333333333333333333333444444444444444444444444444444444', ticDocsdiscounts)
        }

        // _ticDocsdiscounts[index][field] = value;
        // setFormData(newFormData);
    };
    /***************************************************************************************** */

    const onDropdownChange = (e, item) => {
        // console.log(item, "qqqqqqqqqqqqqqqq")
        const updatedTicDocsdiscounts = ticDocsdiscounts.map((docsItem) => {
            if (docsItem.id === item.id) {
                const foundItem = ticTpItems.find((item) => item.id == e.value.code);
                let _popust='';
                if (foundItem.condition) {
                    docsItem.procenat = ''
                    docsItem.procenat = foundItem.condition
                    _popust = foundItem.condition * 0.01 * docsItem.price * docsItem.output;
                } else {
                    docsItem.procenat = ''
                    _popust = foundItem.minfee;
                }
                docsItem.discountvalue = _popust
                return {
                    ...docsItem,
                    discount: e.value.code,
                    discountLabel: e.value.name,
                    ddTicTpItem: e.value
                };
            }
            return docsItem;
        });
        setTicDocsdiscounts(updatedTicDocsdiscounts); // Ažuriraj stanje sa novim podacima
        // setDiscountRefresh(prev => prev + 1);
    };

    /*********************************************************************************** */
    return (
        <>
            <div key={refresh} className="scrollable-content" style={{ backgroundColor: '#fff' }}>
                <Toast ref={toast} />
                {(ticDocsdiscounts) ? (
                    ticDocsdiscounts.map((item) => (
                        <>
                            <div key={item.id} style={{ paddingTop: 15, paddingBottom: 0, backgroundColor: item.id === highlightedId ? '#b7dfb7' : 'transparent' }}>
                                <div className="grid" style={{ paddingTop: 0, width: "100%" }}>
                                    <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <span className="p-float-label">
                                            <Dropdown id="discount"
                                                value={item.ddTicTpItem}
                                                options={ddTicTpItems}
                                                onChange={(e) => onDropdownChange(e, item)}
                                                required
                                                optionLabel="name"
                                                placeholder="Select One"
                                                className={classNames({ 'p-invalid': submitted && !item.discount })}
                                                style={{ width: '100%', maxWidth: '100%' }}
                                                panelStyle={{ maxWidth: '100%' }}
                                            />
                                            {submitted && !item.discount && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                            <label htmlFor={`discount-${item.id}`}>{translations[selectedLanguage].Discount}</label>
                                        </span>
                                    </div>
                                    <div className="field col-12 md:col-3" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <span className="p-float-label">
                                            <InputText
                                                id={`procenat-${item.id}`}
                                                className="p-inputtext-sm"
                                                value={item.procenat}
                                                onChange={(e) => onInputChangeL(e, 'procenat', item.docsid, item)}
                                                style={{ width: '100%' }}
                                            />
                                            <label htmlFor={`procenat-${item.id}`}>{translations[selectedLanguage].Procenat}</label>
                                        </span>
                                    </div>
                                    <div className="field col-12 md:col-3" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <span className="p-float-label">
                                            <InputText
                                                id={`discountvalue-${item.id}`}
                                                className="p-inputtext-sm"
                                                value={item.discountvalue}
                                                onChange={(e) => onInputChangeL(e, 'discountvalue', item.docsid, item)}
                                                style={{ width: '100%' }}
                                            />
                                            <label htmlFor={`discountvalue-${item.id}`}>{translations[selectedLanguage].Iznos}</label>
                                        </span>
                                    </div>
                                    <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <span className="p-float-label">
                                            <InputText
                                                id={`eksternibroj-${item.id}`}
                                                className="p-inputtext-sm"
                                                value={item.eksternibroj}
                                                onChange={(e) => onInputChangeL(e, 'eksternibroj', item.docsid, item)}
                                                style={{ width: '100%' }}
                                            />
                                            <label htmlFor={`eksternibroj-${item.id}`}>{translations[selectedLanguage].Uslov}</label>
                                        </span>
                                    </div>
                                    <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            icon="pi pi-percentage"
                                            className="p-button"
                                            style={{ width: '35px' }}
                                            text
                                            raised
                                            severity="warning"
                                            size="small"
                                            onClick={(e) => handleUpdateClick(item, e)}
                                            tooltip={translations[selectedLanguage].PrimeniNaTekucuStavku}
                                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        ></Button>
                                        <Button
                                            icon="pi pi-percentage"
                                            className="p-button"
                                            style={{ width: '35px' }}
                                            size="small"
                                            text
                                            raised
                                            onClick={(e) => handleCreateAllClick(item, e)}
                                            tooltip={translations[selectedLanguage].PrimeniNaSveStavke}
                                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        ></Button>
                                        <Button
                                            icon="pi pi-percentage"
                                            className="p-button"
                                            style={{ width: '35px' }}
                                            text
                                            raised severity="danger"
                                            size="small"
                                            onClick={(e) => handleDelete(item, e)}
                                            tooltip={translations[selectedLanguage].ObrisiTekucuStavku}
                                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        ></Button>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </>
                    )
                    )
                ) : null}
            </div>
        </>
    );
}