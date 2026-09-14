import { useState } from "react";
import "./shipment.css"
import { RiNotification3Fill } from "react-icons/ri";
import { GiCancel, GiHelp } from "react-icons/gi";
import { FcNext } from "react-icons/fc";

function Shipment() {
  const [formData, setFormData] = useState({
    portOfEntry: "",
    arrivalDate: "",
    carrierName: "",
    weight: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    console.log("Shipment information:", formData);

    // Later:
    // move to Step 2
  };

  return (
    <div className="shipment-page">

      {/* ================= NAVBAR ================= */}
      <header className="top-navbar">

        <div className="portal-logo">
          <img src="./images/sqcc-logo.jpeg"/>
        </div>

        <nav className="navbar-links">
          <a href="/Importer-menu">Dashboard</a>

          <a
            href="/shipments"
            className="active"
          >
            Shipments
          </a>

          <a href="/certificates">Certificates</a>

          <a href="/invoices">Invoices</a>
        </nav>

        <div className="navbar-actions">

          <button className="new-submission-btn">
            New Submission
          </button>

          <button className="icon-btn">
           <RiNotification3Fill size={15}/>
          </button>

          <button className="icon-btn">
            <GiHelp size={15}/>
          </button>

          <div className="profile-circle">
            A
          </div>

        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main className="shipment-container">

        <section className="shipment-header">

          <h1>New Shipment Submission</h1>

          <p>
            Please provide the initial details for your incoming shipment
            to begin the quality control process.
          </p>

        </section>


        {/* ================= STEPS ================= */}
        <div className="steps-container">

          <div className="step-item active-step">

            <div className="step-circle">
              1
            </div>

            <span>
              Shipment Info
            </span>

          </div>


          <div className="step-line"></div>


          <div className="step-item">

            <div className="step-circle">
              2
            </div>

            <span>
              Product Details
            </span>

          </div>


          <div className="step-line"></div>


          <div className="step-item">

            <div className="step-circle">
              3
            </div>

            <span>
              Document Upload
            </span>

          </div>


          <div className="step-line"></div>


          <div className="step-item">

            <div className="step-circle">
              4
            </div>

            <span>
              Review & Submit
            </span>

          </div>

        </div>


        {/* ================= FORM CARD ================= */}
        <form
          className="shipment-card"
          onSubmit={handleNext}
        >

          <div className="card-content">

            <h2>
              Step 1: General Shipment Information
            </h2>

            <div className="divider"></div>


            {/* ROW 1 */}
            <div className="form-grid">

              <div className="form-group">

                <label>
                  Port of Entry <span>*</span>
                </label>

                <select
                  name="portOfEntry"
                  value={formData.portOfEntry}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Entry Port
                  </option>

                  <option value="Berbera">
                    Berbera Port
                  </option>

                  <option value="Hargeisa">
                    Hargeisa Airport
                  </option>

                  <option value="Borama">
                    Borama
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Estimated Date of Arrival <span>*</span>
                </label>

                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* ROW 2 */}
            <div className="form-grid">

              <div className="form-group">

                <label>
                  Carrier Name / Vessel
                </label>

                <input
                  type="text"
                  name="carrierName"
                  value={formData.carrierName}
                  onChange={handleChange}
                  placeholder="e.g. MSC Berbera V2"
                />

              </div>


              <div className="form-group">

                <label>
                  Total Weight (Metric Tons)
                </label>

                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />

              </div>

            </div>


            {/* DESCRIPTION */}
            <div className="form-group description-group">

              <label>
                Brief Shipment Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="General description of goods being imported..."
              />

            </div>

          </div>


          {/* ================= CARD FOOTER ================= */}
          <div className="card-footer">

            <button
              type="button"
              className="cancel-btn"
            >
              <GiCancel size={19}/>
            </button>

            <button
              type="submit"
              className="next-btn"
            >
               <FcNext size={15}/>
              <span>→</span>
            </button>

          </div>

        </form>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="site-footer">

        <strong>
          © 2024 Somaliland Quality Control Commission.
          All Rights Reserved.
        </strong>

        <div className="footer-links">

          <a href="/privacy">
            Privacy Policy
          </a>

          <a href="/terms">
            Terms of Service
          </a>

          <a href="/standards">
            Regulatory Standards
          </a>

        </div>

      </footer>

    </div>
  );
}

export default Shipment;







// import { useState } from "react"
// import { FcNext } from "react-icons/fc";
// import { GiCancel, GiHelp } from "react-icons/gi";

// import { RiNotification3Fill } from "react-icons/ri";
// import "./shipment.css"

// const Shipment = () => {
//   const [formData,setFormData] = useState({
//     portOfEntry:"",
//     arrivalDate:"",
//     carrierName:"",
//     weight:"",
//     description:"",
//   })
//   const handlechange = (e) =>{
//     const {name,value} = e.target;
//     setFormData((prev)=>({
//       ...prev,
//       [name]:value,
//     }))
//   }
//   const handlenext = (e) => {
//     e.preventDefault();
//     console.log("Shipment information:",formData)
//   }
//   return (
//    <>
//    <div className="ship-page">
//    {/* navbar */}
//    <header className="tops-navbarr">
//     <div className="logo-portal">
//       <img src="./images/sqcc-logo.jpeg"/>
//     </div>
//     <nav className="por-nav-links">
//       <a href="/impor-dash">DashBoard</a>
//       <a href="/creating-new-shipment">Shipments</a>
//       <a href="/Certification">Certificates</a>
//       <a href="/impor-dash">Invoices</a>
//     </nav>
//     <div className="nav-actionns">
//       <button className="new-sub-btn">
//         New Submission
//       </button>
//       <button>
//         <RiNotification3Fill size={15}/>
//       </button>
//       <button className="icon-btn">
//         <GiHelp size={15}/>
//       </button>
//       <div className="profile-circle">
//        A
//       </div>
//     </div>
//    </header>
//    </div>
//    {/* main */}
//    <main className="shipment-cont">
//    <section className="shipment-header">
//    <h1>New Shipment Submission </h1>
//    <p> Please Provide Intial Details For Your Incoming  Shipment to Begin Quality Control Process</p>
//    </section>
//    {/* Steps */}
//    <div className="Steps-counter">
//     <div className="step-item">
//     <div className="step-Circle">
//       1
//       <span>Shipment Info</span>
//     </div>
//     <div className="step-line"></div>
//     <div className="step-Circle">
//      2
//      <span>Product Details</span>
//     </div>
//      <div className="step-line"></div>
//      <div className="step-Circle">
//      3
//      <span>Document Upload</span>
//     </div>
//      <div className="step-line"></div>
//      <div className="step-Circle">
//      4
//      <span>Reiview And Submit</span>
//     </div>
//     </div>
//    </div>
//    {/* Form Card */}
//    <form className="shipment-card" onSubmit={handlenext}>
//     <div className="card-content">
//       <h2>Step 1: General Shipment Information</h2>
//       <div className="divider"></div>
//       {/* row 1 */}
//       <div className="form-grid">
//       <div className="form-group">
//         <label>Port Of Entry <span>*</span></label>
//         <select 
//         name="portOfEntry"
//         value={formData.portOfEntry}
//         required>
//           <option>Select Entry Port</option>
//           <option value="BerBera">BerBera Port</option>
//           <option value="Cigaal">Cigaal international Airpot</option>
//           <option value="Wajalle">Wajaale</option>

//         </select>
//       </div>
//       <div className="form-group">
//         <label>Estimated Date Of Arrival <span>*</span></label>
//         <input 
//         type="date"
//         name="arrivalDate"
//         value={formData.arrivalDate}
//         onChange={handlechange}
//         required
//         />
//       </div>
//       </div>
//       {/* row 2 */}
//       <div className="form-grid">
//         <div className="form-group">
//           <label>Carrier Name / Vessel</label>
//           <input
//           type="text"
//           name="carrierName"
//           value={formData.carrierName}
//           placeholder="e.g. MSC BerBera V2"
//           />
//         </div>
//         <div className="form-group">
//           <label>Total Weight(Metric Tons)</label>
//           <input
//           type="number"
//           name="weight"
//           value={formData.weight}
//           onChange={handlechange}
//           placeholder="0.00"
//           min={0}
//           step="0.01"
//           />
//         </div>
//       </div>
//       {/* description */}
//       <div className="form-group">
//         <label>Brief Shipment Description</label>
//         <textarea
//          name="description"
//          value={formData.description}
//          onChange={handlechange}
//          placeholder="Genaral Description of Goods Being Imported..."
//          />
//       </div>
//     </div>
//     {/* card footer */}
//     <div className="card-footer">
//       <button type="cancel" className="cancel-btn" >
//       <GiCancel size={19}/>
//       </button>
//       <button type="submit" className="submit-btn">
//         <FcNext size={15}/>
//       </button>
//     </div>
//    </form>
//    </main>
//    {/* Footer */}
//    <footer className="portal-footer">
//     <strong>
//       © 2026 Somaliland Quality Control Commison 
//       All rights Reserved
//     </strong>
//     <div className="footer-links">
//     <a href="/privacy">Privacy policy</a>
//     <a href="/Terms">Terms Of Service</a>
//     <a href="/Regulatory">Regulatory Standards</a>
//     </div>
//    </footer>
//    </>
//   )
// }

// export default Shipment