import React from 'react';
import axios from 'axios';
import './App.css';
import DataGrid, { ColumnLabels, Filters } from './DataGrid'
import { Column, Filter, NumberFilter, NumberColumn } from './Column'

const App: React.FC = () => {

  const cols = {
    name: new Column(),
    count: new NumberColumn(true),
    extra: new Column()
  }

  type ColsFilters = Filters<typeof cols>;


  const elephantCols = {
    name: new Column(true),
    affiliation: new Column(false),
    dob: new NumberColumn(),
    // species: new Column(),
    // image: new ImageColumn()
  }

  interface Elephant {
    name: string,
    affiliation: string,
    dob: number,
    species: string,
    image: string
  }


  type ElephantLabels = ColumnLabels<typeof elephantCols>

  const elephantLabels: ElephantLabels = {
    name: "Vardas",
    affiliation: "Apsistojęs",
    dob: "Gimimo metai",
    // species: "Rūšis",
    // image: "Nuotrauka"
  }

  type Labels = ColumnLabels<typeof cols>;


  const labels: Labels = {
    name: "Vardas",
    count: "Kiekis",
    extra: "Ekstra"
  };

  const getElephants = (): Promise<Elephant[]> => {
    return axios.get('https://elephant-api.herokuapp.com/elephants/sex/Female').then(
      (value) => {
        return value.data;
      }
    ).catch(e => {
      console.log(e)
      throw e;
    }
    );
  }

  const queryData = (filters: ColsFilters) => {
    const data = [
      { name: "a1", count: 1, extra: "Global" },
      { name: "qaz", count: 2, extra: "empire" },
      { name: "zzz", count: 5, extra: "ego" }];

    return Promise.all(data);
  }



  return (
    <div className="App">
      <DataGrid cols={cols} labels={labels} queryData={queryData} />
      {/* <DataGrid cols={elephantCols} labels={elephantLabels} queryData={getElephants} /> */}
    </div>
  );
}

export default App;
