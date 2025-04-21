import { ColumnsAliasType } from "@helpers/globalColumns";

export const aliasColAnggota: ColumnsAliasType[] = [
  {
    index: "user_code",
    alias: "Kode Anggota",
    order: 1
  },
  {
    index: "nik",
    alias: "NIK",
    order: 2
  },
  {
    index: "fullname",
    alias: "Nama Lengkap",
    order: 3
  },
  {
    index: "department",
    alias: "Department",
    order: 4
  },
  {
    index: "jabatan",
    alias: "Jabatan",
    order: 5
  },
  {
    index: "is_verification",
    alias: "Status",
    dataType: "STRING",
    order: 6
  },
  {
    index: "is_active",
    alias: "Aktif",
    dataType: "STRING",
    order: 8
  },
  {
    index: "last_login",
    alias: "Terakhir Login",
    dataType: "DATE",
    order: 9
  },
  {
    index: "join_date",
    alias: "Tanggal Bergabung",
    dataType: "DATE",
    order: 10
  }
]

export const aliasColAdmin: ColumnsAliasType[] = [
  // {
  //   index: "nik",
  //   alias: "NIK",
  //   order: 2
  // },
  {
    index: "fullname",
    alias: "Nama Lengkap",
    order: 1
  },
  {
    index: "username",
    alias: "Nama Pengguna",
    order: 2
  },
  {
    index: "is_active",
    alias: "Status",
    order: 3
  },
  {
    index: "last_login",
    alias: "Terakhir Login",
    dataType: "DATE",
    order: 4
  },
  {
    index: "join_date",
    alias: "Tanggal Bergabung",
    dataType: "DATE",
    order: 5
  },
  {
    index: "role",
    alias: "Posisi",
    dataType: "STRING",
    order: 2
  },
  {
    index: "department",
    alias: "Department",
    dataType: "STRING",
    order: 2
  }
]