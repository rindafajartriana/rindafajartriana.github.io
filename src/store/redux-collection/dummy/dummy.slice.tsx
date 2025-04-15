import {
  AddUser,
  Agenda,
  Authkey,
  Building,
  Calendar,
  Chat,
  DatabaseStack,
  Document,
  EyeIcon,
  HomeIcon,
  ScaleIcon,
  Structure,
  UsersIcon,
} from "@assets/icons/_index";
import DataAdministrator from "@pages/data-administrator";
import DataAnggota from "@pages/data-anggota";
import Department from "@pages/department";
import HistoryLaporan from "@pages/history-laporan";
import DashboardPage from "@pages/home";
import Jabatan from "@pages/jabatan";
import Area from "@pages/area";
import KalenderKegiatan from "@pages/kalender-kegiatan";
import PesanPage from "@pages/pesan";
import Profile from "@pages/profile";
import Role from "@pages/role";
import StrukturOrganisasi from "@pages/struktur-organisasi";
import Training from "@pages/training";
import { createSlice } from "@reduxjs/toolkit";

const reducerName = "dummy";
export const initialState = {
  isOpenSidebar: undefined,
  data: [],
  privateRoutes: [
    {
      id: 1,
      name: "Dashboard",
      path: "",
      order: 0,
      component: DashboardPage,
      icon: HomeIcon,
      access: {
        view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
        chart: ["PENGURUS"],
        counter: ["SU", "ADMIN"],
        agenda: ["ANGGOTA"],
      },
    },
    {
      id: 2,
      name: "Master Data",
      path: "master-data",
      order: 1,
      icon: DatabaseStack,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 3,
      name: "Data Anggota",
      path: "master-data/data-anggota",
      order: 2,
      component: DataAnggota,
      id_parent: 2,
      icon: UsersIcon,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 4,
      name: "Administrator",
      path: "master-data/administrator",
      order: 3,
      component: DataAdministrator,
      id_parent: 2,
      icon: AddUser,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 11,
      name: "Posisi",
      path: "master-data/role",
      order: 3,
      component: Role,
      id_parent: 2,
      icon: Authkey,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 12,
      name: "Department",
      path: "master-data/department",
      order: 3,
      component: Department,
      id_parent: 2,
      icon: Building,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 13,
      name: "Jabatan",
      path: "master-data/jabatan",
      order: 3,
      component: Jabatan,
      id_parent: 2,
      icon: ScaleIcon,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 14,
      name: "Area",
      path: "master-data/area",
      order: 3,
      component: Area,
      id_parent: 2,
      icon: Structure,
      access: {
        view: ["SU", "ADMIN"],
      },
    },
    {
      id: 5,
      name: "Daftar Dokumen",
      path: "daftar-dokumen-5r",
      order: 4,
      icon: Document,
      access: {
        view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
      },
    },
    {
      id: 6,
      name: "Asuransi Property",
      path: "agenda-kegiatan-5r/kalender-kegiatan",
      order: 5,
      component: KalenderKegiatan,
      id_parent: 5,
      icon: Structure,
      access: {
        view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
        create: ["SU", "ADMIN"],
      },
    },
    {
      id: 11,
      name: "Asuransi Kargo",
      path: "laporan-tim-5r/tps-history-laporan",
      order: 12,
      component: HistoryLaporan,
      icon: Document,
      id_parent: 5,
      access: {
        view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
        create: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
        export: ["SU", "ADMIN", "PENGURUS"],
        confirm: ["SU", "ADMIN", "PENGURUS"],
      },
    },
    // {
    //   id: 7,
    //   name: "Laporan Tim 5R",
    //   path: "laporan-tim-5r",
    //   order: 6,
    //   // component: DataAnggota,
    //   icon: Document,
    //   access: {
    //     view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
    //     create: ["SU", "ADMIN"]
    //   }
    // },
    // {
    //   id: 11,
    //   name: "TPS / History Laporan",
    //   path: "laporan-tim-5r/tps-history-laporan",
    //   order: 12,
    //   component: HistoryLaporan,
    //   icon: Document,
    //   id_parent: 7,
    //   access: {
    //     view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
    //     create: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
    //     export: ["SU", "ADMIN", "PENGURUS"],
    //     confirm: ["SU", "ADMIN", "PENGURUS"]
    //   }
    // },
    // {
    //   id: 12,
    //   name: "Training / Kuisioner",
    //   path: "laporan-tim-5r/training-kuisioner",
    //   order: 13,
    //   component: Training,
    //   icon: Document,
    //   id_parent: 7,
    //   access: {
    //     view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
    //     create: ["SU", "ADMIN"],
    //     export: ["SU", "ADMIN"],
    //     answer: ["ANGGOTA", "SU", "ADMIN", "PENGURUS"],
    //     // listHistory: ["SU", "ADMIN", "PENGURUS"],
    //     history: ["ANGGOTA", "SU", "ADMIN", "PENGURUS"]
    //   }
    // },
    // {
    //   id: 8,
    //   name: "Agenda Kegiatan 5R",
    //   path: "agenda-kegiatan-5r/",
    //   order: 7,
    //   component: DataAnggota,
    //   icon: Agenda,
    //   access: {
    //     view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"]
    //   }
    // },
    // {
    //   id: 9,
    //   name: "Kalender Kegiatan",
    //   path: "agenda-kegiatan-5r/kalender-kegiatan",
    //   order: 8,
    //   component: KalenderKegiatan,
    //   id_parent: 8,
    //   icon: Calendar,
    //   access: {
    //     view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
    //     create: ["SU", "ADMIN"],
    //     export: ["SU", "ADMIN"],
    //   }
    // },
    // {
    //   id: 10,
    //   name: "Pesan",
    //   path: "pesan",
    //   order: 9,
    //   component: PesanPage,
    //   icon: Chat,
    //   access: {
    //     view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
    //     create: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"]
    //   }
    // },
    {
      id: 999,
      name: "Setup Profile",
      path: "profile",
      order: 10,
      component: Profile,
      hidden: true,
      access: {
        view: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
        create: ["SU", "ADMIN", "PENGURUS", "ANGGOTA"],
      },
    },
  ],
};

export const dummySlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setIsOpenSidebar: (state: any, { payload }) => {
      state.isOpenSidebar = payload;
    },
  },
});

export const { setIsOpenSidebar } = dummySlice.actions;

export const dummySliceReducer = {
  [reducerName]: dummySlice.reducer,
};
