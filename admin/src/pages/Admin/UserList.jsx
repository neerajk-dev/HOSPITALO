import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const UserList = () => {
  const { aToken, patients = [], getAllPatients } = useContext(AdminContext)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true)
      await getAllPatients()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [getAllPatients])

  useEffect(() => {
    if (aToken) {
      fetchPatients()
    } else {
      setLoading(false)
    }
  }, [aToken, fetchPatients])

  const filteredPatients = (patients || []).filter((patient) => {
    const query = searchTerm.toLowerCase()
    const name = (patient.name || '').toLowerCase()
    const email = (patient.email || '').toLowerCase()
    const gender = (patient.gender || '').toLowerCase()
    const address = `${patient.address?.line1 || ''} ${patient.address?.line2 || ''}`.toLowerCase()

    return !query || name.includes(query) || email.includes(query) || gender.includes(query) || address.includes(query)
  })

  const totals = {
    total: patients.length,
    male: patients.filter((patient) => patient.gender?.toLowerCase() === 'male').length,
    female: patients.filter((patient) => patient.gender?.toLowerCase() === 'female').length,
  }

  return (
    <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 ml-20 md:ml-64 w-[calc(100%-5rem)] md:w-[calc(100%-16rem)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">Admin Panel</p>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Patient Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage all registered patients with a clean overview.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Patients</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">{totals.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Male</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">{totals.male}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Female</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">{totals.female}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <input
            type="text"
            placeholder="Search by name, email, gender or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        {loading ? (
          <div className="flex h-[70vh] w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No patients found</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPatients.map((item, index) => {
              const initials = (item.name || 'P').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
              const address = `${item.address?.line1 || ''} ${item.address?.line2 || ''}`.trim() || 'No address provided'

              return (
                <div
                  key={item._id || index}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-indigo-100" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-semibold text-white">
                          {initials}
                        </div>
                      )}
                      <div>
                        <p className="text-base font-semibold text-slate-800 dark:text-white">{item.name || 'Unnamed patient'}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.gender || 'Not specified'}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Patient
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p><span className="font-medium text-slate-700 dark:text-slate-200">DOB:</span> {item.dob || 'Not provided'}</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-200">Email:</span> {item.email || 'Not provided'}</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-200">Address:</span> {address}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserList;