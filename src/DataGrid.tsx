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


export interface Props<D extends object> {
  queryData: () => Promise<Array<D>>;
  labels: ColumnLabels<D>
  cols: { [K in keyof object]: Column<D> },
}

export interface State<D extends object> {
  data: Array<D>
}

const DataGridHeader = <D extends object>({ namedCols, labels }: { labels: ColumnLabels<D>, namedCols: [keyof D, Column<D>][] }) =>
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

const DataGridBody = <D extends object>({ data, namedCols }: { data: D[], namedCols: [keyof D, Column<D>][] }) =>
  <tbody>
    {
      data.map((row, index) =>
        <tr key={index}>
          {
            namedCols.map(([name, col], index) =>
              <td key={index}>{col.renderCell(row, name)}</td>
            )
          }
        </tr>
      )
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
    const { data } = this.state;
    const namedCols = Object.entries(cols) as [keyof D, Column<D>][];

    return (
      <table>
        <DataGridHeader namedCols={namedCols} labels={labels} />
        <DataGridBody namedCols={namedCols} data={data} />
      </table>
    );
  }

  componentDidMount = () => {
    const { queryData } = this.props;
    queryData().then(data => this.setState({ data }));
  }
}

export default DataGrid
