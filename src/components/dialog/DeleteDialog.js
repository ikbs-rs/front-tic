import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const DeleteDialog = ({ visible, inAction, item, onHide, onDelete }) => {
  let action = ''
  if (inAction=='delete') {
    action =  `Are you sure you want to confirm the deletion: `;
  } else if (inAction=='deleteall') {
    action =  `Are you sure you want to confirm the deletion all: `;
  } else {
    action =  `Are you sure you want to confirm the deletion: `;
  }
  const deleteProductDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={onDelete} />
    </div>
  );

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={onHide}>
      <div className="flex align-items-center justify-content-center">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        {item && (
          <span>
           {action} <b>{item}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
