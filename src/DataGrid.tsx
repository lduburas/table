import * as React from 'react';
import { Column } from './Column';


export type ColumnLabels<D> = {
  [C in keyof D]: string
};


type FiltersKeys<Q extends any> = {
  [C in keyof Q]: Exclude<ReturnType<Q[C]['isFiltered']>, false> extends false ? never : C
}[keyof Q]

export type Filters<Q extends any> = {
  [C in FiltersKeys<Q>]: ReturnType<ReturnType<Q[C]['getFilter']>['convert']>
}

type Totals<D> = {
  [C in keyof D]?: any
}

export type Result<D> = {
  data: Array<any>,
  totals: Totals<D>
} | Array<any>




export interface Props<D extends object> {
  queryData: (filters: Filters<D>) => Promise<Result<D>>;
  labels: ColumnLabels<D>
  cols: { [K in keyof object]: Column },
}

export interface State<D> {
  data: Array<any>
  totals?: Totals<D>
}

const DataGridHeader = <D extends object>({ namedCols, labels }: { labels: ColumnLabels<D>, namedCols: [keyof D, Column][] }) =>
  <thead>
    <tr>
      {
        namedCols.map(([name, col]) =>
          <th>{col.renderHeader(labels[name])}</th>
        )
      }
    </tr>
    {
      namedCols.some(([_, col]) => col.isFiltered()) &&
      <tr>
        {
          namedCols.map(([name, col]) =>
            <th>{col.isFiltered() && col.getFilter().renderFilter()}</th>
          )
        }
      </tr>
    }
  </thead>

const DataGridBody = <D extends object>({ data, totals, namedCols }: { data: Array<any>, totals?: Totals<D>, namedCols: [keyof D, Column][] }) =>
  <tbody>
    {
      data.map((row, index) =>
        <tr key={index}>
          {
            namedCols.map(([name, col], index) =>
              <td key={index}>{col.renderCell(row, name.toString())}</td>
            )
          }
        </tr>
      )
    }
    {
      <tr>
         {
            totals && 
            namedCols.map(([name, col], index) =>
              <td key={index}>{col.hasTotal(totals, name.toString()) && col.renderTotal(totals, name.toString())}</td>
            )
          }
      </tr>
    }
  </tbody>

class DataGrid<D extends object> extends React.Component<Props<D>, State<D>> {

  constructor(props: Props<D>) {
    super(props);
    this.state = {
      data: []
    }
  }

  render = () => {
    const { cols, labels } = this.props;
    const { data, totals } = this.state;
    const namedCols = Object.entries(cols) as [keyof D, Column][];

    return (
      <table>
        <DataGridHeader namedCols={namedCols} labels={labels} />
        <DataGridBody namedCols={namedCols} data={data} totals={totals}/>
      </table>
    );
  }

  componentDidMount = () => {
    const { queryData } = this.props;
    queryData({} as Filters<D>).then( data => {
      const state = data instanceof Array ? {data} : { data: data.data, totals: data.totals };
      this.setState(state);
    });
  }
}

export default DataGrid
