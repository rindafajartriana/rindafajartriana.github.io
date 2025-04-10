import { ColumnsAliasType, ColumnsType } from "@helpers/globalColumns"
import _ from "lodash"

export const columnsDummy: ColumnsType[] = [
  {
    fieldName: "id",
    dataType: "INTEGER",
    defaultWidth: 80,
  },
  {
    fieldName: "nama",
    dataType: "STRING"
  },
  {
    fieldName: "umur",
    dataType: "INTEGER"
  },
  {
    fieldName: "tanggal_lahir",
    dataType: "DATE"
  }
]

export const columnsAlias: ColumnsAliasType[] = [
  {
    "index": "umur",
    "alias": "UMUR (tahun) | Testlongtext Wrap",
    "wrap": true,
    "defaultWidth": 250,
    "extendField": [
      {
        "name": "Tertua",
        "value": (data, originalData) => _.maxBy(originalData, "umur")?.nama
      }
    ]
  },
  // {
  //   "index": "tanggal_lahir",
  //   "render": {
  //     "wrap": true,
  //     "value": (item) => "re text value"
  //   }
  // }
]

export const dataDummy = [
  {
    id: 1,
    nama: "adi",
    umur: 30,
    tanggal_lahir: "2000-10-10"
  },
  {
    id: 2,
    nama: "budi",
    umur: 25,
    tanggal_lahir: "1999-12-25"
  },
  {
    id: 3,
    nama: "asep",
    umur: 25,
    tanggal_lahir: "1999-07-12"
  },
  {
    id: 4,
    nama: "aa gym",
    umur: 25,
    tanggal_lahir: "1950-02-02"
  },
  {
    id: 5,
    nama: "fikri jr",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 6,
    nama: "reza",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 7,
    nama: "irsyad",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 8,
    nama: "fikri jr",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 9,
    nama: "reza",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 10,
    nama: "irsyad",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 11,
    nama: "fikri jr",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 12,
    nama: "reza",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
  {
    id: 13,
    nama: "irsyad",
    umur: 25,
    tanggal_lahir: "1980-12-30"
  },
]