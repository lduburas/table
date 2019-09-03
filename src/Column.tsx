import * as React from 'react';

type Scalar = string | number | null;

type Range<T extends Scalar> = {
  from: T,
  to: T
}

type FilterType = Scalar | Range<Scalar>;

export class Filter<T extends FilterType = string> {
  
  renderFilter = (): React.ReactNode =>
    <input type="text" />

  convert = (value: any): T =>
    value
}

export class NumberFilter extends Filter<number> {

  convert = (value: any): number => {
    const numberValue = Number(value);
    return isNaN(numberValue) ? null : value;
  }
  
}

export class Column<FF extends Filter<F> | false = false, F extends (FilterType) = string, T = string> {

  readonly filter: FF;

  textAlign: "left" | "right" | "center";

  constructor(filter: FF | boolean = false) {
    this.filter = ((filter instanceof Filter || filter === true) ? new Filter<string>() : false) as FF;
    this.textAlign = "left";
  }

  renderHeader = (label: string): React.ReactNode =>
    <div style={{ textAlign: this.textAlign }}>{label}</div>

  renderCell = (rowValue: any, name: string): React.ReactNode =>
    <div style={{ textAlign: this.textAlign }}>{this.renderValue(rowValue[name])}</div>

  renderValue = (columnValue: any): React.ReactNode =>
    columnValue;

  isFiltered = ():FF =>
    this.filter 

  getFilter = (): Filter<F> => {
    if (this.filter instanceof Filter)
      return this.filter;
    throw Error("Column not filtered");
  }

}

export class NumberColumn<FF extends Filter<F> | false = false, F extends FilterType = number> extends Column<FF, F, number> {

  constructor(filter: FF | boolean = false) {
    super(((filter instanceof Filter || filter === true) ? new NumberFilter() : false) as FF);
    this.textAlign = "right";
  }

  renderValue = (columnValue: any): React.ReactNode => {
    const numberValue = Number(columnValue);
    return isNaN(numberValue) ? null : numberValue;
  }

}

// export class ImageColumn<D> extends Column<D> {

//   renderCell = (rowValue: D, name: keyof D): React.ReactNode =>
//     <img src={rowValue[name] as any as string} height={100} width={160} />

// }



