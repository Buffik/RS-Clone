/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hook';
import { TodoFromClient } from '../../../types/types';
import DatePicker from '../DatePicker/DatePicker';
import SearchDropDown from '../SearchDropDown/SearchDropDown';
import styles from './TodoCreateModal.module.scss';

interface ITextData {
  title: string;
  text: string;
  company: string;
  type: string;
  call: string;
  meet: string;
  calc: string;
  common: string;
  create: string;
}

interface ILanguage {
  [key: string]: ITextData;
}

const dict: ILanguage = {
  ru: {
    title: 'Введите заголовок',
    text: 'Описание',
    company: 'Выберите компанию',
    type: 'Тип события',
    call: 'Звонок',
    meet: 'Встреча',
    calc: 'Расчет',
    common: 'Задача',
    create: 'Создать',
  },
  en: {
    title: 'Title',
    text: 'Body',
    company: 'Company',
    type: 'Event type',
    call: 'Call',
    meet: 'Meet',
    calc: 'Calculation',
    common: 'Task',
    create: 'Create',
  },
};

interface iTodoCreateModal {
  propsStartTime: string;
  propsStartDate: string;
}

function todoCreateModal({ propsStartTime, propsStartDate }: iTodoCreateModal) {
  const languageState: string = useAppSelector(
    (state) => state.language.language,
  );
  const [timeValid, setTimeValid] = useState(false);
  const [titleValid, setTitleValid] = useState(false);
  const [companyValid, setCompanyValid] = useState(false);
  const [allDataValid, setAllDataValid] = useState(false);
  const [todoData, setTodoData] = useState<TodoFromClient>({
    company: '',
    isDone: false,
    data: {
      type: 'common',
      startTime: '',
      endTime: '',
      title: '',
      text: '',
    },
  });

  console.log(timeValid);

  useEffect(() => {
    if (todoData.data.title) {
      setTitleValid(true);
    } else {
      setTitleValid(false);
    }
    if (todoData.company) {
      setCompanyValid(true);
    } else {
      setCompanyValid(false);
    }
  }, [todoData]);

  useEffect(() => {
    if (timeValid && titleValid && companyValid) {
      setAllDataValid(true);
    } else setAllDataValid(false);
  }, [timeValid, titleValid, companyValid]);

  return (
    <Box>
      <DatePicker
        setTimeValid={setTimeValid}
        setTodoData={setTodoData}
        propsStartTime={propsStartTime}
        propsStartDate={propsStartDate}
      />
      <TextField
        className={styles.textInput}
        fullWidth
        id="outlined-controlled"
        label={dict[languageState].title}
        placeholder={dict[languageState].title}
        value={todoData.data.title}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTodoData({
            ...todoData,
            data: { ...todoData.data, title: event.currentTarget.value },
          });
        }}
      />
      <TextField
        fullWidth
        className={styles.textInput}
        id="outlined-controlled"
        label={dict[languageState].text}
        placeholder={dict[languageState].text}
        value={todoData.data.text}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTodoData({
            ...todoData,
            data: { ...todoData.data, text: event.currentTarget.value },
          });
        }}
      />
      <div className={styles.dropDown}>
        <FormControl>
          <InputLabel id="todoTypeLabel">{dict[languageState].type}</InputLabel>
          <Select
            labelId="todoTypeLabel"
            id="todoType"
            value={todoData.data.type}
            label={dict[languageState].type}
            onChange={(e) =>
              setTodoData({
                ...todoData,
                data: { ...todoData.data, type: e.target.value },
              })
            }
          >
            <MenuItem value="call">{dict[languageState].call}</MenuItem>
            <MenuItem value="calc">{dict[languageState].calc}</MenuItem>
            <MenuItem value="meet">{dict[languageState].meet}</MenuItem>
            <MenuItem value="common">{dict[languageState].common}</MenuItem>
          </Select>
        </FormControl>
        <SearchDropDown setTodoData={setTodoData} />
        <Button
          variant="outlined"
          className={styles.dropDownButton}
          disabled={!allDataValid}
        >
          {dict[languageState].create}
        </Button>
      </div>
    </Box>
  );
}

export default todoCreateModal;