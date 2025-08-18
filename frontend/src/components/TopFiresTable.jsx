import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const TopFiresTable = () => {
  const [fires, setFires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(""); // default: all years
  const [years, setYears] = useState([]);

  // 🔹 Fetch distinct years for the dropdown
  useEffect(() => {
    fetch("https://xlgjrlpuv8.execute-api.us-east-2.amazonaws.com/stage1/largest-fires")
      .then(res => res.json())
      .then(data => setYears(data.years || [])) // expecting { years: [2000, 2001, ...] }
      .catch(err => console.error("Error fetching years:", err));
  }, []);

  // 🔹 Fetch fires when year changes
  useEffect(() => {
    let url = "https://xlgjrlpuv8.execute-api.us-east-2.amazonaws.com/stage1/largest-fires";
    if (year) {
      url += `?year=${year}`;
    }

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setFires(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching fires:", err);
        setLoading(false);
      });
  }, [year]);

  const columns = useMemo(
    () => [
      { Header: "Fire Name", accessor: "firename" },
      { Header: "Year", accessor: "fireyear" },
      {
        Header: "Size (acres)",
        accessor: "size_acres",
        Cell: ({ value }) => value.toLocaleString()
      }
    ],
    []
  );

  const tableInstance = useTable({ columns, data: fires }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Top 20 Largest Fires</h2>

      {/* 🔹 Year Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Year:</label>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          {...getTableProps()}
          className="min-w-full border-collapse border border-gray-300"
        >
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border border-gray-300 px-4 py-2 cursor-pointer text-left"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopFiresTable;
