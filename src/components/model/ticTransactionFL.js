import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import { ToggleButton } from 'primereact/togglebutton';
import {
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  flexRender,
  useMaterialReactTable,
  MaterialReactTable
} from "material-react-table";

import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Toast } from "primereact/toast";
import './index.css';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { TicDocService } from "../../service/model/TicDocService";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import TicTransaction from './ticTransaction';
import TicTransactiostornogrpL from "./ticTransactiostornogrpL"

export default function TicPrivilegeL(props) {

  const [searchParams] = useSearchParams();
  const docVr = searchParams.get('docVr');
  const objName = 'tic_doc';
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const emptyTicDoc = EmptyEntities[objName]

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  const [checked7, setChecked7] = useState(false);
  const [checked8, setChecked8] = useState(false);
  const [checked9, setChecked9] = useState(false);
  const [checked10, setChecked10] = useState(false);


  const buttonClassCustom1 = checked1 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom2 = checked2 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom3 = checked3 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom4 = checked4 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom5 = checked5 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom6 = checked6 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom7 = checked7 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom8 = checked8 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom9 = checked9 ? "toggle-button-checked" : "toggle-button-unchecked";
  const buttonClassCustom10 = checked10 ? "toggle-button-checked" : "toggle-button-unchecked";

  const [ticDocs, setTicDocs] = useState([]);
  const [ticDoc, setTicDoc] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [componentKey, setComponentKey] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth > 700 && window.innerWidth <= 1400);
  let [refresh, setRefresh] = useState(0);

  const [docTip, setDocTip] = useState('');
  const [ticDocvrs, setTicDocvrs] = useState([]);
  const [ticDocvr, setTicDocvr] = useState(null);
  const [ticDocobj, setTicDocobj] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [ticTransactiostornogrpLVisible, setTicTransactiostornogrpLVisible] = useState(false)
  const [delRezDialogVisible, setDelRezDialogVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [akcija, setAkcija] = useState(null);
  const [isSmallScreen7, setIsSmallScreen7] = useState(window.innerWidth <= 700);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen7(window.innerWidth <= 700);
      if (window.innerWidth > 700) {
        setIsDropdownVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hideDelRezDialog = () => {
    setDelRezDialogVisible(false);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth > 700 && window.innerWidth <= 1400);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setTicDocs([]);
        setComponentKey(prevKey => prevKey + 1); // Promena ključa za ponovno montiranje tabele
        setLoading(true);
        const ticDocService = new TicDocService();
        const data = await ticDocService.getTransactionFLista(
          checked1, checked2, checked3, checked4, checked5,
          checked6, checked7, checked8, checked9, checked10
        );

        console.log("Fetched data:", data); // Log za proveru podataka
        setTicDocs(data); // Postavite nove podatke
        setLoading(false);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh, checked1, checked2, checked3, checked4, checked5, checked6, checked7, checked8, checked9, checked10]);


  async function fetchDoc(rowData) {
    try {
      const ticDocService = new TicDocService();
      // const data = await ticDocService.getTicDoc(rowData.id);
      const data = await ticDocService.getTicDocP(rowData.id);
      //console.log(uId, "*-*-*************fetchDoc*************-*", data)
      Object.assign(data, rowData);
      return data;
    } catch (error) {
      console.error(error);
      // Obrada greške ako je potrebna
    }
  }

  const setTicDocDialog = (ticDoc) => {
    setVisible(true)
    setDocTip("CREATE")
    setTicDoc({ ...ticDoc });
  }

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticDocs.length; i++) {
      if (ticDocs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _ticDocs = [...ticDocs];
    let _ticDoc = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.docTip === "CREATE") {
      _ticDocs.push(_ticDoc);
    } else if (localObj.newObj.docTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticDocs[index] = _ticDoc;
    } else if ((localObj.newObj.docTip === "DELETE")) {
      _ticDocs = ticDocs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDoc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDoc ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docTip}`, life: 3000 });
    setTicDocs(_ticDocs);
    setTicDoc(emptyTicDoc);
  };

  const paidBodyTemplate = (rowData) => {
    const setParentTdBackground = (element) => {
      const parentTd = element?.parentNode;
      if (parentTd) {
        // parentTd.style.backgroundColor = "white"; 
      }
    };
    const handleClick = () => {
      console.log("Ikona je kliknuta!");
      // Ovde možeš dodati bilo koju akciju koju želiš pokrenuti
    };
    return (
      <div ref={(el) => setParentTdBackground(el)}>
        {rowData.paid == 1 ? (
          <img
            src="./images/paid.png"
            alt="Delivery"
            width="35"
            height="35"
            className="delivery-icon"
            onClick={handleClick} // Povezivanje funkcije sa klikom
          />
        ) : null}
      </div>
    );
  };

  const deliveryBodyTemplate = (rowData) => {

    const setParentTdBackground = (element) => {
      const parentTd = element?.parentNode;
      if (parentTd) {
        // Ostavljen prazan za eventualnu buduću upotrebu
      }
    };

    // Funkcija koja će se pokrenuti na klik
    const handleClick = () => {
      console.log("Ikona je kliknuta!");
      // Ovde možeš dodati bilo koju akciju koju želiš pokrenuti
    };


    return (
      <div ref={(el) => setParentTdBackground(el)}>
        {rowData.delivery == 1 ? (
          <img
            src="./images/delivery1.png"
            alt="Delivery"
            width="30"
            height="30"
            className="delivery-icon"
            onClick={handleClick} // Povezivanje funkcije sa klikom
          />
        ) : null}
      </div>
    );
  };

  const stornoBodyTemplate = (rowData) => {
    const setParentTdBackground = (element) => {
      const parentTd = element?.parentNode;
      if (parentTd) {
        // parentTd.style.backgroundColor = "white"; 
      }
    };
    const handleClick = () => {
      console.log("Ikona je kliknuta!");
      // Ovde možeš dodati bilo koju akciju koju želiš pokrenuti
    };



    return (
      <div ref={(el) => setParentTdBackground(el)}>
        {rowData.docstorno == 1 ? (
          <img
            src="./images/redflg.png"
            alt="Storno"
            width="30"
            height="30"
            className="delivery-icon"
            onClick={handleClick} // Povezivanje funkcije sa klikom
          />
        ) : null}
      </div>
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={async () => {
            const rowDoc = await fetchDoc(rowData)
            //console.log(rowData, "***************rowData****************", rowDoc)
            setTicDocDialog(rowDoc)
            setDocTip("UPDATE")
            setTicDocobj(rowDoc.docobj)
            setTicDocvr(rowDoc.docvr)
          }}
          text
          raised ></Button>

      </div>
    );
  };
  const columns = [
    {
      accessorKey: 'NEW',
      header: '..', size: '3%',
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '3%'
        } // Stil zaglavlja
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '3%'
        } // Stil sadržaja ćelije
      },
      Cell: ({ row }) => actionTemplate(row.original)
    },
    {
      accessorKey: 'broj', header: translations[selectedLanguage].TransactionSkr, size: '5%',
      muiTableHeadCellProps: { sx: { width: '5%' } },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          height: 'auto', width: '5%'
        }
      }
    },
    {
      accessorKey: 'text', header: translations[selectedLanguage].nevent, size: '10%',
      muiTableHeadCellProps: { sx: { width: '10%' } },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          height: 'auto', width: '10%'
        }
      }
    },
    {
      accessorKey: 'venue', header: translations[selectedLanguage].hall, size: '7%',
      muiTableHeadCellProps: { sx: { width: '7%' } },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          height: 'auto', width: '7%'
        }
      }
    },
    {
      accessorKey: 'npar', header: translations[selectedLanguage].npar, size: '10%',
      muiTableHeadCellProps: {
        sx: {
          width: '10%',
          flex: 1,
        }
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '10%',
          flex: 1,
        }
      }
    },
    {
      accessorKey: 'nchannel', header: translations[selectedLanguage].Kanal, size: '5%',
      muiTableHeadCellProps: { sx: { width: '5%' } }, muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          height: 'auto', width: '5%'
        }
      }
    },
    {
      accessorKey: 'username', header: translations[selectedLanguage].UserSkr, size: '5%',
      muiTableHeadCellProps: { sx: { width: '5%' } }, muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          height: 'auto', width: '5%'
        }
      }
    },
    {
      accessorKey: 'startda', header: translations[selectedLanguage].begda, size: '5%', Cell: ({ row }) => formatDateColumn(row.original, 'startda'),
      muiTableHeadCellProps: { sx: { width: '5%' } }, muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          height: 'auto', width: '5%'
        }
      }
    },
    {
      accessorKey: 'starttm', header: translations[selectedLanguage].begtm, size: '5%', Cell: ({ row }) => formatTimeColumn(row.original, 'starttm'),
      muiTableHeadCellProps: { sx: { width: '5%' } }, muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        }
      }
    },
    {
      accessorKey: 'tmreserv', header: translations[selectedLanguage].tmreserv, size: '7%', Cell: ({ row }) => formatDatetime(row.original, 'tmreserv'),
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '7%'
        }
      }, muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '7%'
        }
      }
    },
    {
      accessorKey: 'tm', header: translations[selectedLanguage].tm, size: '7%', Cell: ({ row }) => formatDatetime(row.original, 'tm'),
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '7%'
        }
      }, muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '7%'
        }
      }
    },
    {
      accessorKey: 'output', // Polje koje predstavlja podatak
      header: translations[selectedLanguage].brojkarti, size: '5%',// Naslov kolone
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        }
      },
      Cell: ({ row }) => {
        // Obrada podataka i prikaz
        const value = row.original.output; // Preuzimanje vrednosti
        const numericValue = isNaN(Number(value)) ? '-' : Math.floor(Number(value)); // Provera i konverzija
        return <span>{numericValue}</span>; // Vraćanje formatiranog rezultata
      }
    },
    {
      accessorKey: 'paid', // Ključ za pristup vrednosti u podacima
      header: translations[selectedLanguage].paid, size: '5%', // Naslov kolone
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        } // Stil zaglavlja
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        } // Stil sadržaja ćelije
      },
      Cell: ({ row }) => paidBodyTemplate(row.original) // Pozivanje funkcije za renderovanje
    },
    {
      accessorKey: 'delivery', // Ključ za pristup vrednosti u podacima
      header: translations[selectedLanguage].delivery, size: '5%', // Naslov kolone
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        } // Stil zaglavlja
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        } // Stil sadržaja ćelije
      },
      Cell: ({ row }) => deliveryBodyTemplate(row.original) // Pozivanje funkcije za renderovanje
    },
    {
      accessorKey: 'reservation', header: translations[selectedLanguage].Rez, size: '5%',
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '5%'
        }
      }
    },
    {
      accessorKey: 'docstorno', // Ključ za pristup vrednosti u podacima
      header: translations[selectedLanguage].Storno, size: '3%', // Naslov kolone
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '3%'
        } // Stil zaglavlja
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '3%'
        } // Stil sadržaja ćelije
      },
      Cell: ({ row }) => stornoBodyTemplate(row.original) // Pozivanje funkcije za renderovanje
    },
    {
      accessorKey: 'statusfiskal', header: translations[selectedLanguage].StatusFiskal, size: '3%',
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '3%'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto', width: '3%'
        }
      }
    },
    {
      accessorKey: 'statustransakcije',
      header: translations[selectedLanguage].Status,
      size: '3%',
      muiTableHeadCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto',
          overflow: 'visible',
          width: '3%'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          height: 'auto',
          width: '3%'
        }
      },
      Cell: ({ row }) => (
        <div
          style={{
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'center'
          }}
        >
          {row.original.statustransakcije}
        </div>
      )
    }

  ];

  const formatDateColumn = (rowData, field) => {
    return rowData[field];
    // return DateFunction.formatDate(rowData[field]);
  };

  const formatTimeColumn = (rowData, field) => {
    return DateFunction.convertTimeToDisplayFormat(rowData[field]);
  };

  const formatDatetime = (rowData, field) => {
    if (rowData[field]) {
      return DateFunction.formatDatetime(rowData[field]);
    }
  };

  const formatNumber = (value) => {
    if (typeof value === "number" || !isNaN(value)) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    } else {
      return "-";  // Ako vrednost nije broj
    }
  };

  const rowClass = (rowData) => {
    let backgroundColor = '';
    if (rowData.storno === '1') {
      backgroundColor = '#bac935'; // primer za highlight-row-10
    } else if (rowData.statustransakcije === '5') {
      backgroundColor = '#828486'; // primer za highlight-row-2
    } else if (rowData.statustransakcije === '6') {
      backgroundColor = '#f1ef90'; // primer za highlight-row-3
    } else if (rowData.statustransakcije === '9') {
      backgroundColor = '#d87b9a'; // primer za highlight-row-4
    } else if (rowData.statustransakcije === '21') {
      backgroundColor = '#a06314'; // primer za highlight-row-5
    } else if (rowData.statustransakcije === '20') {
      backgroundColor = '#5dceb5'; // primer za highlight-row-6
    } else if (rowData.statustransakcije === '11') {
      backgroundColor = '#fcfcfc'; // primer za highlight-row-7
    } else if (rowData.statustransakcije === '12') {
      backgroundColor = '#e4656b'; // primer za highlight-row-8
    } else if (rowData.statusdelivery === '4') {
      backgroundColor = '#aa4fa4c6'; // primer za highlight-row-9
    } else if (rowData.statustransakcije === '0') {
      backgroundColor = '#a281b8'; // primer za highlight-row-1
    }
    return {
      backgroundColor: backgroundColor, // Vraćamo boju pozadine kao stil
    };
  };
  const handleStorno = async () => {
    try {
      setTicTransactiostornogrpLDialog(true);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch cmnPar data',
        life: 3000
      });
    }
  };

  const handleSpajanje = async () => {
    try {
      console.log(selectedProducts, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch cmnPar data',
        life: 3000
      });
    }
  };
  const setTicTransactiostornogrpLDialog = () => {
    setTicTransactiostornogrpLVisible(true);
  };
  const handleStornoClose = (newObj) => {
    setTicTransactiostornogrpLVisible(false);
    setRefresh(prev => prev + 1)
  }
  const showDelRezDialog = () => {
    setDelRezDialogVisible(true);
  };
  const handleDelRezClick = async () => {
    try {
      setSubmitted(true);
      const ticDocService = new TicDocService();
      // await ticDocService.deleteRez(ticEvent);
      hideDelRezDialog();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  };
  const renderHeader = () => {
    return (
      <div className="header-container">
        {/* <Button
          icon="pi pi-bars"
          className="dropdown-toggle"
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
          style={{ display: isSmallScreen7 ? 'block' : 'none' }}
        /> */}
        {/* <div className={`toggle-buttons-container ${isDropdownVisible ? 'dropdown-menu' : ''}`}> */}
        {/* <Button
            icon="pi pi-bars"
            className="dropdown-toggle"
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            style={{ display: isSmallScreen ? 'block' : 'none' }}
          /> */}
        <Button label={translations[selectedLanguage].Razdvajanje}
          icon="pi pi-file-export"
          onClick={(e) => {
            handleStorno();
            closeSidebar();
          }}
          severity="warning"
          outlined
          disabled={!ticDoc}
          className={`${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`} />

        <Button label={translations[selectedLanguage].Spajanje}
          icon="pi pi-file-import"
          onClick={(e) => {
            handleSpajanje();
            closeSidebar();
          }}
          severity="warning"
          outlined
          disabled={!ticDoc}
          className={`${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`} />

        <Button label={translations[selectedLanguage].Storno}
          icon="pi pi-trash"
          onClick={(e) => {
            handleStorno();
            closeSidebar();
          }}
          severity="danger"
          outlined
          disabled={!ticDoc}
          className={`${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`} />

        <ToggleButton
          id={`tgAll}`}
          onLabel="All"
          offLabel="All"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked1}
          text raised
          onChange={(e) => {
            setChecked1(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom1} custom1  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglForDelivery`}
          onLabel="ForDelivery"
          offLabel="ForDelivery"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked2}
          raised
          onChange={(e) => {
            setChecked2(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom2} custom2  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglInDelivery}`}
          onLabel="InDelivery"
          offLabel="InDelivery"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked3}
          raised
          onChange={(e) => {
            setChecked3(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom3} custom3  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglDelivered`}
          onLabel="Delivered"
          offLabel="Delivered"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked4}
          raised
          onChange={(e) => {
            setChecked4(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom4} custom4  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglReturned`}
          onLabel="Returned"
          offLabel="Returned"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked5}
          raised
          onChange={(e) => {
            setChecked5(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom5} custom5  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglPaid`}
          onLabel="Paid"
          offLabel="Paid"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked6}
          raised
          onChange={(e) => {
            setChecked6(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom6} custom6  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglReserved}`}
          onLabel="Reserved"
          offLabel="Reserved"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked7}
          raised
          onChange={(e) => {
            setChecked7(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom7} custom7  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglExpired`}
          onLabel="Expired"
          offLabel="Expired"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked8}
          raised
          onChange={(e) => {
            setChecked8(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom8} custom8  ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglCanceled`}
          onLabel="Canceled"
          offLabel="Canceled"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked9}
          raised
          onChange={(e) => {
            setChecked9(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom9} custom9 ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />
        <ToggleButton
          id={`tglStorno`}
          onLabel="Storno"
          offLabel="Storno"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked10}
          raised
          onChange={(e) => {
            setChecked10(e.value);
            closeSidebar();
          }}
          className={`${buttonClassCustom10} custom10 ${isSmallScreen ? 'toggle-button-small' : 'toggle-button-sidebar'}`}
        />

      </div>
      // </div>
    );
  };
  const header = renderHeader();

  const handleRowSelectionChange = (row, event) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = row.getIsSelected();

      if (isSelected) {
        setTicDoc({})
        return prevSelected.filter((product) => product.id !== row.original.id);
      } else {
        setTicDoc(row.original)
        return [...prevSelected, row.original];
      }
    });
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    < >
      <Toast ref={toast} />

      {/* Proba da vidimo dugme */}
      {isSmallScreen7 && (
        <div
          className={`sidebar-content ${isSidebarOpen ? 'sidebar-content-open' : ''}`}
          style={{
            position: 'fixed',
            bottom: '250px',
            right: '0px',
            zIndex: 1100,
            backgroundColor: '#26292cec',
            color: '#fff',
            borderRadius: '10%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          }}>
          <Button
            icon="pi pi-bars"
            className={`sidebar-toggle-btn ${isSidebarOpen ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Menu"
          />
        </div>
      )}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {header}
      </div>
      <MaterialReactTable
        id={'transactionId'}
        key={componentKey}
        onRowSelectionChange={setRowSelection}
        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            row.getToggleSelectedHandler()(event); // Poziva handler za selekciju/deselekciju
            handleRowSelectionChange(row, event); // Poziva dodatnu funkciju
          },
          sx: {
            ...rowClass(row.original)
          }
        })}
        columns={columns}
        data={ticDocs}
        initialState={{
          density: 'compact', pagination: { pageSize: 50, pageIndex: 0 },
          sorting: [
            {
              id: 'tm',
              desc: true,
            },
          ]
        }}
        state={{ isLoading: loading, rowSelection }}
        enableRowSelection
        enableRowSelectionOnClick
        // onRowSelectionChange={(updatedSelection) => setRowSelection(updatedSelection)}
        enablePagination
        // pageSize={50}
        // pageIndex={1}
        enableColumnResizing
        enableStickyHeader
        enableGlobalFilter // Omogućava globalni filter
        onGlobalFilterChange={setGlobalFilter} // Praćenje promene filtera
        globalFilter={globalFilter} // Kontrolisana vrednost filtera
        // muiTableContainerProps={{ sx: { maxHeight: 785 } }}
        muiTableContainerProps={{ sx: { maxHeight: 'calc(100vh - 200px)' } }}
        muiTablePaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'column',
            // height: '100vh', // Osigurava da tabela zauzme ceo ekran
          },
        }}
        muiTableFooterProps={{
          sx: {
            position: 'sticky', // Čini footer "sticky"
            bottom: 0,
            zIndex: 999999, // Podiže footer iznad ostalih elemenata
            backgroundColor: 'white', // Osigurava da footer ima pozadinu
          },
        }}
        muiTableHeaderProps={{
          sx: {
            position: 'sticky', // Čini footer "sticky"
            bottom: 0,
            zIndex: 999999, // Podiže footer iznad ostalih elemenata
            backgroundColor: 'white', // Osigurava da footer ima pozadinu
          },
        }}

        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {isSmallScreen7 ? (
              <></>
            ) :
              (
                <Box sx={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                  {header}
                </Box>
              )}
            <div className="flex-grow-1" />
            <b>{translations[selectedLanguage].TransactionList}</b>
            <div className="flex-grow-1" />
          </Box>

        )}
        renderGlobalFilter={(props) => <MRT_GlobalFilterTextField {...props} />}
      // enableGlobalFilter={true}
      // enableStickyFooter={true}

      />
      <Dialog
        // header={translations[selectedLanguage].Doc}
        header={
          <div className="dialog-header">
            <Button
              label={translations[selectedLanguage].Cancel} icon="pi pi-times"
              onClick={() => {
                ++refresh
                console.log(refresh, "########################")
                setRefresh(refresh)
                setVisible(false);
                // setShowMyComponent(false);
              }}
              severity="secondary" raised
            />
            {/* <span>{translations[selectedLanguage].Doc}</span>                         */}
          </div>
        }
        visible={visible}
        style={{ width: '95%', height: '1400px' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicTransaction
            parameter={"inputTextValue"}
            ticDoc={ticDoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            ticDocvr={ticDocvr}
            ticDocobj={ticDocobj}
            docTip={docTip}
            eventTip={"SAL"}
          />
        )}
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <Button
              label={translations[selectedLanguage].Cancel} icon="pi pi-times"
              onClick={() => {
                setTicTransactiostornogrpLVisible(false);
              }}
              severity="secondary" raised
            />
          </div>
        }
        visible={ticTransactiostornogrpLVisible}
        style={{ width: '80%' }}
        onHide={() => {
          setTicTransactiostornogrpLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicTransactiostornogrpL
            parameter={"inputTextValue"}
            // ticDocs={ticDocs}
            ticDoc={ticDoc}
            handleStornoClose={handleStornoClose}
            dialog={true}
            akcija={akcija}
          />
        )}
      </Dialog>
    </>
  );
}
