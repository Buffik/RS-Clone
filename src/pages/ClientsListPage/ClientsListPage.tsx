/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SearchIcon from '@mui/icons-material/Search';
import ModeIcon from '@mui/icons-material/Mode';
import { useAppSelector } from '../../hook';
import { FullClientData } from '../../types/types';
import styles from './ClientsListPage.module.scss';
import EditClientModal from './EditClientModal/EditClientModal';
import AddClientModal from './AddClientModal/AddClientModal';
import LoadingSpinner from '../../components/UI/Spinner/LoadingSpinner';
import useFetching from '../../hooks/useFetching';
import ClientsService from '../../services/ClientsService';

// --------------------------------------------------------------
interface TextKey {
  сompany: string;
  email: string;
  phone: string;
  search: string;
  deletedData: string;
}
interface Text {
  [key: string]: TextKey;
}
const text: Text = {
  ru: {
    сompany: 'Компания',
    email: 'Почта',
    phone: 'Телефон',
    search: 'Поиск',
    deletedData: 'Показать удаленные компании',
  },
  en: {
    сompany: 'Company',
    email: 'Email',
    phone: 'Phone',
    search: 'Search',
    deletedData: 'Show deleted companies',
  },
};
// ------------------------------------------------------------------

function ClientsListPage() {
  const { clients } = useAppSelector((state) => state.data);
  const [renderClients, setRenderClients] = useState<FullClientData[]>(clients);
  const [renderDeletedClients, setRenderDeletedClients] = useState<
    FullClientData[]
  >([]);
  const [shouldFetchDeletedClients, setShouldFetchDeletedClients] =
    useState(false);
  const [getDeletedClients, fetchingDeletedClients] = useFetching(async () => {
    const response = await ClientsService.fetchClients(true);
    const { data } = response;
    setRenderDeletedClients(data);
  });

  const languageState: string = useAppSelector((state) => state.data.language);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedClient, setSelectedClient] = useState<
    undefined | FullClientData
  >(undefined);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setSelectedClient(undefined);
  };
  const handleOpenEdit = (contact: FullClientData) => {
    setSelectedClient(contact);
    setOpenAdd(true);
  };

  useEffect(() => {
    setRenderClients(clients);
  }, [clients]);

  useEffect(() => {
    if (shouldFetchDeletedClients) getDeletedClients();
  }, [shouldFetchDeletedClients, clients]);

  const inputSearch = (searchText: string) => {
    const searchCompanyName = clients.filter((el) =>
      el.data.companyName.toLowerCase().includes(searchText.toLowerCase()),
    );
    const searchMail = clients.filter((el) =>
      el.contacts?.commonMail?.toLowerCase().includes(searchText.toLowerCase()),
    );
    const searchAddress = clients.filter((el) =>
      el.data.address?.toLowerCase().includes(searchText.toLowerCase()),
    );
    const tempState = Array.from(
      new Set([...searchCompanyName, ...searchMail, ...searchAddress]),
    );
    setRenderClients(tempState);
  };

  if (!clients.length && clients) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={styles.modalWrapper}
      >
        <Box>
          {selectedClient ? (
            <div>
              <EditClientModal
                shouldFetchDeletedClients={shouldFetchDeletedClients}
                setOpenAdd={setOpenAdd}
                selectedClient={selectedClient}
              />
            </div>
          ) : (
            <AddClientModal setOpenAdd={setOpenAdd} />
          )}
        </Box>
      </Modal>

      <Paper elevation={4} className={styles.clientListPage}>
        <div className={styles.search}>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              onInput={(event) => {
                inputSearch(event.currentTarget.value);
              }}
              placeholder={text[languageState].search}
              type="search"
            />
          </div>
          <FormControlLabel
            className={styles.check}
            labelPlacement="start"
            label={text[languageState].deletedData}
            control={
              <Checkbox
                checked={shouldFetchDeletedClients}
                onChange={() => {
                  setShouldFetchDeletedClients((prev) => !prev);
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />
        </div>
        <div className={styles.topRow}>
          <div className={styles.topCompanyName}>
            {text[languageState].сompany}
          </div>
          <div className={styles.topMail}>{text[languageState].email}</div>
          <div className={styles.topPhone}>{text[languageState].phone}</div>
          <div className={styles.topBtn}>
            {!shouldFetchDeletedClients && (
              <IconButton onClick={handleOpenAdd}>
                <ControlPointIcon fontSize="large" />
              </IconButton>
            )}
          </div>
        </div>
        {fetchingDeletedClients && (
          <div>
            <LoadingSpinner />
          </div>
        )}
        {shouldFetchDeletedClients
          ? renderDeletedClients.map((client: FullClientData) => (
              <div key={Math.random()} className={styles.contactBox}>
                <div className={styles.divider} />
                <div className={styles.row}>
                  {/* eslint-disable-next-line max-len */}
                  <div className={styles.companyName}>
                    {client.data.companyName}
                  </div>
                  <div className={styles.mail}>
                    {client.contacts?.commonMail}
                  </div>
                  <div className={styles.phone}>
                    {client.contacts?.commonPhone}
                  </div>
                  <div className={styles.btn}>
                    <IconButton
                      onClick={() => {
                        handleOpenEdit(client);
                      }}
                    >
                      <ModeIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))
          : renderClients.map((client: FullClientData) => (
              <div key={Math.random()} className={styles.contactBox}>
                <div className={styles.divider} />
                <div className={styles.row}>
                  {/* eslint-disable-next-line max-len */}
                  <div className={styles.companyName}>
                    {client.data.companyName}
                  </div>
                  <div className={styles.mail}>
                    {client.contacts?.commonMail}
                  </div>
                  <div className={styles.phone}>
                    {client.contacts?.commonPhone}
                  </div>
                  <div className={styles.btn}>
                    <IconButton
                      onClick={() => {
                        handleOpenEdit(client);
                      }}
                    >
                      <ModeIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
      </Paper>
    </>
  );
}

export default ClientsListPage;
