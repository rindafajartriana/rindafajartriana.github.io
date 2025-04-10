import React, { useEffect, useMemo } from 'react'

import HighchartsReact from "highcharts-react-official"
import Highcharts from 'highcharts'
import { useFetchListHistoryLaporanMutation, useGetListDashboardQuery, useGetListHistoryLaporanQuery, useGetListHistoryTrainingQuery } from '@store/redux-collection/history-laporan'
import _ from 'lodash'
import Spinner from '@components/atoms/spinner'
import { useGetListKegiatanQuery } from '@store/redux-collection/kegiatan'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

let options = {
  title: {
    text: 'History tps/ pelaporan per item',
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: [{
        enabled: true,
        distance: 20,
      }, {
        enabled: true,
        distance: -40,
        // format: '{point.percentage:.1f}%',
        format: '{point.y}',
        style: {
          fontSize: '1.2em',
          textOutline: 'none',
          opacity: 0.7
        },
        filter: {
          operator: '>',
          property: 'percentage',
          value: 10
        }
      }]
    }
  },
  series: [],
  credits: {
    enabled: false
  },
}

const options2 = {
  title: {
    text: 'Hasil Training',
  },
  series: [{
    type: 'bar',
    data: [1, 2, 3]
  }],
  credits: {
    enabled: false
  },
}

const optConfig = {
  title: {
    text: 'title',
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: [{
        enabled: true,
        distance: 20,
      }, {
        enabled: true,
        distance: -40,
        // format: '{point.percentage:.1f}%',
        format: '{point.y}',
        style: {
          fontSize: '1.2em',
          textOutline: 'none',
          opacity: 0.7
        },
        filter: {
          operator: '>',
          property: 'percentage',
          value: 10
        }
      }]
    }
  },
  series: [],
  credits: {
    enabled: false
  },
}

const Chart = () => {
  const { data: dataKegiatan, isFetching: isLoadingKegiatan } = useGetListKegiatanQuery({}, { refetchOnMountOrArgChange: true })
  // const { data: dataTps, isFetching: isLoadingTps } = useGetListHistoryLaporanQuery({ type: "tps" }, { refetchOnMountOrArgChange: true })
  // const { data: dataTraining, isFetching: isLoadingTraining, refetch: refetchHistory } = useGetListHistoryTrainingQuery({ type: "training" }, { refetchOnMountOrArgChange: true })
  const { data: dataTps, isFetching: isLoadingTps } = useGetListDashboardQuery({ type: "tps" }, { refetchOnMountOrArgChange: true })
  const { data: dataTraining, isFetching: isLoadingTraining, refetch: refetchHistory } = useGetListDashboardQuery({ type: "training" }, { refetchOnMountOrArgChange: true })

  const chartDataTpsItem = useMemo(() => {
    const flatData = _.flatMap(dataTps?.data, x => {
      return _.map(x?.detail, xx => ({
        name: xx?.nama_item?.toLowerCase()?.trim?.(),
        jumlah: !isNaN(xx?.jumlah) ? Number(xx?.jumlah) : 0
      }))
    })

    return {
      title: {
        text: 'History tps/ pelaporan per item',
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: true,
            distance: 20,
          }, {
            enabled: true,
            distance: -40,
            // format: '{point.percentage:.1f}%',
            format: '{point.y}',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }]
        }
      },
      series: [{
        type: 'pie',
        name: 'Total Item',
        colorByPoint: true,
        data: _(flatData)
          .groupBy('name')
          .map((x, name) => ({
            name: name,
            y: _.sumBy(x, 'jumlah')
          }))
          .orderBy(["y"], ["desc"])
          .take(10)
          .value()
      }],
      credits: {
        enabled: false
      },
    }
  }, [JSON.stringify(dataTps?.data ?? [])])

  const chartDataTpsAktif = useMemo(() => {
    const flatData = _.flatMap(dataTps?.data, x => ({
      area: x?.area,
      jumlah: 1
    }))

    return {
      title: {
        text: 'Aktifitas TPS',
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: true,
            distance: 20,
          }, {
            enabled: true,
            distance: -40,
            // format: '{point.percentage:.1f}%',
            format: '{point.y}',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }]
        }
      },
      series: [{
        type: 'pie',
        name: 'Total Pelaporan',
        colorByPoint: true,
        data: _(flatData)
          .groupBy('area')
          .map((x, area) => ({
            name: area,
            y: _.sumBy(x, 'jumlah')
          }))
          .orderBy(["y"], ["desc"])
          .take(10)
          .value()
      }],
      credits: {
        enabled: false
      },
    }
  }, [JSON.stringify(dataTps?.data ?? [])])

  const chartDataTraining = useMemo(() => {
    const flatData = _.flatMap(dataTraining?.data, x => ({
      name: x?.is_lulus === 1 ? "Lulus" : "Tidak Lulus",
      jumlah: 1,
      department: x?.department_name,
      jabatan: x?.jabatan_name
    }))

    return {
      title: {
        text: 'Hasil Training',
      },
      tooltip: {
        shared: true,
        useHTML: true,
        // formatter: (x) => {
        //   console.log("x", x?.series?.name)
        //   var text = `
        //   <div>
        //     <p>Total: ${x?.chart?.userOptions?.series?.[0]?.data?.y}</p>
        //     <p>test 2</p>
        //   </div>
        //   `
        //   return text;
        // }
        formatter: function () {
          const x: any = this
          // console.log("x", x)
          var text = `
          <div>
            <p>${x?.name}</p>
            <p style="padding-left: 10px">Total: ${x?.y}</p>
            <div>
              <p>Department: </p>
              <div style="padding-left: 10px">
                ${
                  _.map(x?.department, xx => {
                  return `<p>${xx?.name} : ${xx?.jumlah}</p>`
                  })?.join?.("")
                }
              </div>
            </div>
            <div>
              <p>Jabatan: </p>
              <div style="padding-left: 10px">
                ${
                  _.map(x?.jabatan, xx => {
                  return `<p>${xx?.name} : ${xx?.jumlah}</p>`
                  })?.join?.("")
                }
              </div>
            </div>
          </div>
          `
          return text;
        }
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: true,
            distance: 20,
          }, {
            enabled: true,
            distance: -40,
            format: '{point.percentage:.1f}%',
            // format: '{point.y}',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }]
        }
      },
      series: [{
        type: 'pie',
        name: 'Total',
        colorByPoint: true,
        data: _(flatData)
          .groupBy('name')
          .map((x, name) => ({
            name: name,
            y: _.sumBy(x, 'jumlah'),
            department: _(x)
              .groupBy('department')
              .map((xx, department) => ({ name: department, jumlah: _.sumBy(xx, 'jumlah') }))
              .value(),
            jabatan: _(x)
              .groupBy('jabatan')
              .map((xx, jabatan) => ({ name: jabatan, jumlah: _.sumBy(xx, 'jumlah') }))
              .value(),
            // jabatan: x
          }))
          .orderBy(["y"], ["desc"])
          // .take(10)
          .value()
      }],
      credits: {
        enabled: false
      },
    }
  }, [JSON.stringify(dataTraining?.data ?? [])])

  // console.log("Data", chartDataTraining?.series?.[0]?.data)

  const navigate = useNavigate();
  const chartDataAgenda = useMemo(() => {
    const flatData = _.flatMap(dataKegiatan?.data, x => ({
      name: moment(x?.tanggal).format("MMMM"),
      jumlah: 1
    }))

    return {
      title: {
        text: 'Agenda',
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: true,
            distance: 20,
          }, {
            enabled: true,
            distance: -40,
            // format: '{point.percentage:.1f}%',
            format: '{point.y}',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }],
          point: { //additional
            events: {
              click: function () {
                navigate('/admin/agenda-kegiatan-5r/kalender-kegiatan');
              }
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Total Agenda',
        colorByPoint: true,
        data: _(flatData)
          .groupBy('name')
          .map((x, name) => ({
            name: name,
            y: _.sumBy(x, 'jumlah')
          }))
          .orderBy(["y"], ["desc"])
          .take(10)
          .value()
      }],
      credits: {
        enabled: false
      },
    }
  }, [JSON.stringify(dataKegiatan?.data ?? [])])

  return (
    <div className='flex flex-col gap-3'>
      <div className="flex flex-col md:flex-row text-gray-500 px-4 gap-3">
        <div className="w-full md:w-1/2 p-2 bg-white rounded shadow shadow-gray-700">
          {
            isLoadingTps ?
              <div className='flex flex-col h-full justify-center items-center gap-2'>
                <Spinner className='w-12 h-12' />
                <p>Memuat data...</p>
              </div>
              :
              <HighchartsReact
                highcharts={Highcharts}
                options={chartDataTpsItem}
              />
          }
        </div>
        <div className="w-full md:w-1/2 p-2 bg-white rounded shadow shadow-gray-700">
          {
            isLoadingTps ?
              <div className='flex flex-col h-full justify-center items-center gap-2'>
                <Spinner className='w-12 h-12' />
                <p>Memuat data...</p>
              </div>
              :
              <HighchartsReact
                highcharts={Highcharts}
                options={chartDataTpsAktif}
              />
          }
        </div>
      </div>
      <div className="flex flex-col md:flex-row text-gray-500 px-4 gap-3">
        <div className="w-full md:w-1/2 p-2 bg-white rounded shadow shadow-gray-700">
          {
            isLoadingTps ?
              <div className='flex flex-col h-full justify-center items-center gap-2'>
                <Spinner className='w-12 h-12' />
                <p>Memuat data...</p>
              </div>
              :
              <HighchartsReact
                highcharts={Highcharts}
                options={chartDataTraining}
              />
          }
        </div>
        <div className="w-full md:w-1/2 p-2 bg-white rounded shadow shadow-gray-700">
          {
            isLoadingKegiatan ?
              <div className='flex flex-col h-full justify-center items-center gap-2'>
                <Spinner className='w-12 h-12' />
                <p>Memuat data...</p>
              </div>
              :
              <HighchartsReact
                highcharts={Highcharts}
                options={chartDataAgenda}
              />
          }
        </div>
      </div>
    </div>
  )
}

export default Chart