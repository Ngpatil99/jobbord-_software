import React from "react";
import { useState, useEffect } from "react";
import "./index.css";
import { toast } from "react-toastify";
import { backend_url, getCookie } from "../../constant";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AssessmentOverviewAdmin = (props) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setloading] = useState(false);
  const [search, setSearch] = useState("");
  const [addedAdmins, setAddedAdmins] = useState([]);
  const [departements, setDepartments] = useState([]);
  const [adminsToFilter, setAdminsToFilter] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [allAdmins, setAllAdmins] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("All");
  const [allAdminLoading, setAllAdminLoading] = useState(false);

  useEffect(() => {
    getDepartments();
    getAllAdmins();
    const data = props?.test?.testAdmins.map((data) => {
      let obj = {
        admin: data.admin._id,
        access: data.access,
      };
      return obj;
    });
    setSelectedAdmins(data);
  }, []);

  const handleCheckBox = (length) => {
    if (length !== undefined) {
      setSelectedAll(true);
      const data = allAdmins.map((data) => {
        const obj = {
          admin: data._id,
          access: "All Access",
        };
        return obj;
      });
      setSelectedAdmins(data);
    }
  };

  const getAllAdmins = async () => {
    try {
      setAllAdminLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      console.log(decode);
      const response = await axios.get(
        `${backend_url}eqa/${decode.client._id}`,
        { headers: { token: token } }
      );
      setAllAdmins(
        response.data.data.filter((data) => data._id !== decode.user_id)
      );

      console.log(response.data.data);
      setTimeout(() => {
        setAllAdminLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const searchAdminsOnChange = async (e) => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const response = await axios.post(
        `${backend_url}eqa/admin/search?filter=${filterValue}&clientId=${decode.client._id}`,
        {
          searchText: e.target.value,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        if (e.target.value !== "") {
          setAdmins(response.data.data);
        } else {
          setAdmins([]);
        }
      }
      setloading(false);
    } catch (error) {
      console.log(error);
      toast.error("Opps something went wrong please try again!");
    }
  };

  const getDepartments = async () => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(`${backend_url}department`, {
        headers: { token: token },
      });
      if (response.status === 200) {
        setDepartments(response.data.data);
      }
      setloading(false);
    } catch (error) {
      console.log(error);
      toast.error("Opps something went wrong please try again!");
    }
  };

  const filterByDepartment = async (value) => {
    try {
      setAllAdminLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      console.log(decode);
      const response = await axios.get(
        `${backend_url}eqa/sort/admin?filter=${value}&clientId=${decode.client._id}`,
        { headers: { token: token } }
      );
      const data = response.data.data.filter(
        (data) => data._id !== decode.user_id
      );
      if (data.length === 0) {
        toast.warning("No data found.");
        setAllAdmins([]);
      } else {
        setAllAdmins(data);
      }
      setAllAdminLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchedAdmins = (data) => {
    const isAdminExits = addedAdmins.find((admin) => admin._id === data._id);
    if (isAdminExits === undefined) {
      setAddedAdmins([...addedAdmins, data]);
      setAdminsToFilter([...adminsToFilter, data]);
      setSelectedAdmins([...selectedAdmins, { admin: data._id, access: "" }]);
      setSearch("");
    } else {
      toast.warning("Admin already exists.");
    }
  };

  const updateAdmins = async () => {
    try {
      setAdminLoading(true);
      const token = getCookie("Xh7ERL0G");
      await axios.put(
        `${backend_url}test/update/${props.test._id}`,
        {
          ...props.test,
          testAdmins: selectedAdmins,
        },
        { headers: { token: token } }
      );

      toast.success("Admins added successfully.");
      setAdminLoading(false);
      props.close();
      props.getTestById();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="test-admin-container">
      <div className="test-type-box">
        <div className="header">
          <div className="title">
            <span>Add Test Admins</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                props.close();
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z"
                fill="#99B2C6"
              />
            </svg>
          </div>
          <div className="header-border"></div>
        </div>

        <div className="search-row">
          <div className="search-container">
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.7801 11.583L9.84451 8.98072C7.55521 10.58 4.25612 10.3209 2.31989 8.38972C0.383627 6.45853 0.481179 3.52459 2.5424 1.69785C4.60363 -0.128931 7.9142 -0.215386 10.0932 1.50058C12.2723 3.21658 12.5647 6.14034 10.7601 8.16922L13.6957 10.7704C13.885 10.9103 13.9689 11.133 13.9123 11.3456C13.8557 11.5582 13.6685 11.7242 13.4286 11.7745C13.1888 11.8248 12.9375 11.7506 12.7795 11.583H12.7801ZM2.2266 5.14603C2.226 6.64632 3.23974 8.00137 4.79974 8.58511C6.35969 9.16882 8.16246 8.86771 9.37563 7.82075C9.38758 7.80783 9.40025 7.79558 9.41372 7.78407C9.42718 7.77256 9.44085 7.7614 9.45471 7.75063C10.7795 6.54494 11.0299 4.70257 10.066 3.25255C9.10219 1.80253 7.16251 1.1036 5.33039 1.54612C3.49827 1.98864 2.227 3.46312 2.22656 5.14603H2.2266Z"
                fill="#55585D"
              />
            </svg>

            <input
              type="text"
              placeholder="Search Admins"
              onChange={(e) => {
                searchAdminsOnChange(e);
                setSearch(e.target.value);
              }}
              value={search}
            />
            {search !== "" ? (
              <svg
                onClick={() => {
                  setSearch("");
                }}
                style={{ right: 10, cursor: "pointer" }}
                width="12"
                height="12"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z"
                  fill="#99B2C6"
                />
              </svg>
            ) : (
              <></>
            )}
          </div>

          <div className="select-container">
            <select
              onChange={(e) => {
                filterByDepartment(e.target.value);
                setFilterValue(e.target.value);
              }}
            >
              <option value="All">All</option>
              {departements.map((data) => {
                return <option value={data._id}>{data.department}</option>;
              })}
            </select>
          </div>

          {search === "" ? null : (
            <div className="search-results">
              {admins.length === 0 ? (
                <div
                  className="no-data"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>No data found</span>
                </div>
              ) : (
                admins.map((data, index) => {
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        handleSearchedAdmins(data);
                      }}
                    >
                      {data.fullName}
                    </span>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="admin-data-table">
          {allAdmins.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#ECECEC",
                height: "40px",
                fontFamily: "Nunito",
                fontStyle: "normal",
                fontWeight: "500",
                fontSize: "10px",
                lineHeight: "19px",
                borderRadius: "10px",
              }}
            >
              <h1>No data found.</h1>
            </div>
          ) : (
            <table cellSpacing="0" className="admin-table">
              <tr className="admin-table-header">
                <th>
                  {selectedAll ? (
                    <svg
                      style={{
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedAll(false);
                        setSelectedAdmins([]);
                      }}
                      width="16"
                      height="17"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        y="0.498047"
                        width="20"
                        height="20"
                        rx="2"
                        fill="#999999"
                      />
                      <path
                        d="M14 8.49805L8.5 13.998L6 11.498"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      style={{
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleCheckBox(null, allAdmins.length);
                      }}
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="1.19824"
                        width="15"
                        height="15"
                        rx="1.5"
                        stroke="#DDDDDD"
                      />
                    </svg>
                  )}
                  Name
                </th>
                <th>Department</th>
                <th>Email ID</th>
              </tr>
              {allAdmins.map((admin, index) => {
                return (
                  <tr key={index}>
                    <td style={{ display: "flex", alignItem: "center" }}>
                      {allAdminLoading ? (
                        <div className="skeleton" />
                      ) : selectedAdmins?.some((e) => e.admin === admin._id) ? (
                        <svg
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const removedArray = selectedAdmins.filter(
                              (data) => data.admin !== admin._id
                            );
                            setSelectedAdmins(removedArray);
                            setSelectedAll(false);
                          }}
                          width="16"
                          height="17"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.498047"
                            width="20"
                            height="20"
                            rx="2"
                            fill="#999999"
                          />
                          <path
                            d="M14 8.49805L8.5 13.998L6 11.498"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedAdmins([
                              ...selectedAdmins,
                              { admin: admin._id, access: "All Access" },
                            ]);
                          }}
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="1.19824"
                            width="15"
                            height="15"
                            rx="1.5"
                            stroke="#DDDDDD"
                          />
                        </svg>
                      )}
                      {allAdminLoading ? null : admin.fullName}
                    </td>
                    <td>
                      {allAdminLoading ? (
                        <div className="skeleton" />
                      ) : (
                        admin.departmentId?.department
                      )}
                    </td>
                    <td>
                      {allAdminLoading ? (
                        <div className="skeleton" />
                      ) : (
                        admin.email.toLowerCase()
                      )}
                    </td>
                  </tr>
                );
              })}
            </table>
          )}
        </div>

        <div className="button" style={{ marginTop: "5px" }}>
          <div
            className="cancel-btn"
            onClick={() => {
              props.close();
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="white" />
              <path
                d="M12.5 5.5L5.5 12.5"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 5.5L12.5 12.5"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <button>Cancel</button>
          </div>

          <div
            className="next-btn"
            onClick={() => {
              updateAdmins();
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="white" />
              <path
                d="M9.01826 4.0505L8.97489 13.9499"
                stroke="#00C49A"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.04688 8.97852L13.9463 9.02188"
                stroke="#00C49A"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <button>{adminLoading ? "Adding..." : "Add"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentOverviewAdmin;
