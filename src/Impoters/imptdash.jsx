import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    LuDownload,
    LuPlus,
    LuTruck,
    LuClock,
    LuTriangleAlert,
    LuCircleCheck,
    LuHistory
} from "react-icons/lu"



import "./imptdash.css"



const Imptdash = () => {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    // get user shipment

    useEffect(() => {

        const loadDashboard = async () => {

            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/")
                return
            }

            try {

                const headers = {
                    Authorization: `Bearer ${token}`
                }


                // Get logged-in user
                const userResponse = await fetch(
                    "http://localhost:5000/api/me",
                    { headers }
                )


                if (!userResponse.ok) {
                    throw new Error("Invalid session")
                }


                const userData = await userResponse.json()


                // Only importer can access this dashboard
                if (userData.rolee !== "importer") {
                    navigate("/")
                    return
                }


                setUser(userData)


                // Get importer's shipments
                const shipmentResponse = await fetch(
                    "http://localhost:5000/api/shipment/mine",
                    { headers }
                )


                if (!shipmentResponse.ok) {
                    throw new Error("Unable to load shipments")
                }


                const shipmentData =
                    await shipmentResponse.json()


                setShipments(shipmentData)


            } catch (err) {

                console.error(err)

                setError("Could not load dashboard")

            } finally {

                setLoading(false)

            }
        }


        loadDashboard()

    }, [navigate])


  
    // LOADING
  

    if (loading) {

        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        )

    }


   
    // ERROR
   

    if (error) {

        return (
            <div className="dashboard-error">
                {error}
            </div>
        )

    }


    // STATISTICS


    const activeCount = shipments.filter(
        shipment =>
            shipment.status?.toLowerCase() === "pending"
    ).length


    const pendingCount = shipments.filter(
        shipment =>
            shipment.status?.toLowerCase() === "pending"
    ).length


    const approvedCount = shipments.filter(
        shipment =>
            shipment.status?.toLowerCase() === "approved"
    ).length


    const rejectedCount = shipments.filter(
        shipment =>
            shipment.status?.toLowerCase() === "rejected"
    ).length


    // Only show latest 4
    const recentShipments =
        shipments 


    return (

        <div className="dashboard-layout">
            <main className="dashboard-main">


                {/* WELCOME*/}

                <section className="welcome-box">

                    <div className="welcome-content">

                        <h1>
                            Welcome back,
                            <br />

                            <span>
                                {user?.full_name}
                            </span>
                        </h1>


                        <p>
                            You currently have{" "}
                            <strong>
                                {pendingCount}
                            </strong>{" "}
                            shipments pending clearance
                            and{" "}
                            <strong>
                                {rejectedCount}
                            </strong>{" "}
                            actions requiring your attention.
                        </p>

                    </div>


                    <div className="welcome-actions">

                        <button
                            className="btn-report"
                        >
                            <LuDownload size={17} />

                            Compliance Reports
                        </button>


                        <button
                            className="btn-new-submission"
                            onClick={() =>
                                navigate("/shipment")
                            }
                        >
                            <LuPlus size={17} />

                            New Submission
                        </button>

                    </div>

                </section>



                {/*Status card */}

                <section className="stats-grid">


                    {/* ACTIVE */}

                    <div className="stat-card">

                        <p>
                            ACTIVE SHIPMENTS
                        </p>

                        <h2>
                            {activeCount}
                        </h2>

                        <span>
                            <LuTruck size={14} />

                            Current shipments
                        </span>

                    </div>



                    {/* PENDING */}

                    <div className="stat-card pending">

                        <p>
                            PENDING APPROVAL
                        </p>

                        <h2>
                            {pendingCount}
                        </h2>

                        <span>
                            <LuClock size={14} />

                            Awaiting review
                        </span>

                    </div>



                    {/* REQUIRED ACTIONS */}

                    <div className="stat-card action">

                        <p>
                            REQUIRED ACTIONS
                        </p>

                        <h2>
                            {rejectedCount}
                        </h2>

                        <span>
                            <LuTriangleAlert size={14} />

                            Needs attention
                        </span>

                    </div>



                    {/* APPROVED */}

                    <div className="stat-card cleared">

                        <p>
                            CLEARED
                        </p>

                        <h2>
                            {approvedCount}
                        </h2>

                        <span>
                            <LuCircleCheck size={14} />

                            Approved shipments
                        </span>

                    </div>

                </section>



                {/* tabels*/}

                <section className="dashboard-bottom">


                    {/* Recent shipments*/}

                    <div className="panel shipments-panel">


                        <div className="panel-header">

                            <h2>
                                Recent Shipments
                            </h2>


                            <button
                                onClick={() =>
                                    navigate("/shipment")
                                }
                            >
                                View All →
                            </button>

                        </div>



                        <div className="shipment-table">


                            {/* TABLE HEADER */}

                            <div className="table-header">

                                <span>
                                    Ref #
                                </span>

                                <span>
                                    Description
                                </span>

                                <span>
                                    Arrival Date
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Action
                                </span>

                            </div>



                            {/* NO SHIPMENTS */}

                            {recentShipments.length === 0 ? (

                                <div className="empty-state">
                                    No shipments yet.
                                </div>

                            ) : (


                                /* SHIPMENT ROWS */

                                recentShipments.map(
                                    shipment => (

                                        <div
                                            className="shipment-row"
                                            key={shipment.id}
                                        >


                                            <span className="shipment-ref">
                                                {shipment.reference ||
                                                    `SHP-${shipment.id}`}
                                            </span>


                                            <span>
                                                {shipment.product_name ||
                                                    "—"}
                                            </span>


                                            <span>
                                                {shipment.arrival_date ||
                                                    "—"}
                                            </span>


                                            <span>

                                                <span
                                                    className={
                                                        `status-badge ${
                                                            shipment.status
                                                                ?.toLowerCase()
                                                        }`
                                                    }
                                                >
                                                    {shipment.status}
                                                </span>

                                            </span>


                                            <span>

                                                <button
                                                    className="more-button"
                                                >
                                                    ⋮
                                                </button>

                                            </span>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>



                    {/* Recent activity */}

                    <div className="panel activity-panel">


                        <div className="panel-header">

                            <h2>
                                Recent Activity
                            </h2>

                            <LuHistory size={19} />

                        </div>



                        <div className="activity-list">


                            <div className="activity-item">

                                <div className="activity-dot green" />

                                <div>

                                    <small>
                                        Today
                                    </small>

                                    <h3>
                                        Dashboard loaded
                                    </h3>

                                    <p>
                                        Your shipment information
                                        was successfully retrieved.
                                    </p>

                                </div>

                            </div>



                            <div className="activity-item">

                                <div className="activity-dot yellow" />

                                <div>

                                    <small>
                                        Recent
                                    </small>

                                    <h3>
                                        Shipment information
                                    </h3>

                                    <p>
                                        Your latest shipment records
                                        are shown here.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    )
}


export default Imptdash