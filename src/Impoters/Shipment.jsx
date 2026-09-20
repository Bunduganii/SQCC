import { useState } from "react";
import "./shipment.css";
import { RiNotification3Fill } from "react-icons/ri";
import { GiCancel, GiHelp } from "react-icons/gi";
import { FcNext } from "react-icons/fc";
import toast from "react-hot-toast";

// ---- Category-specific field definitions ----
// Each entry = { name, label, type, placeholder }
const CATEGORY_FIELDS = {
  Medicine: [
    { name: "batchNumber", label: "Batch Number", type: "text", placeholder: "e.g. BX-2291" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "manufacturer", label: "Manufacturer", type: "text", placeholder: "e.g. Pfizer" },
  ],
  Food: [
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "originHealthCert", label: "Origin Health Cert #", type: "text", placeholder: "e.g. HC-88231" },
  ],
  Electronics: [
    { name: "complianceCert", label: "Compliance Cert # (CE/FCC)", type: "text", placeholder: "e.g. CE-4471" },
  ],
  Cosmetics: [
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "ingredientList", label: "Key Ingredients", type: "text", placeholder: "e.g. Water, Glycerin..." },
  ],
};

// ---- Document requirements per category ----
const CATEGORY_DOC_LABEL = {
  Medicine: "Manufacturer License",
  Food: "Health/Safety Certificate",
  Electronics: "Compliance Certificate",
  Cosmetics: "Ingredient Safety Data Sheet",
};

const STEP_LABELS = ["Shipment Info", "Product Details", "Document Upload", "Review & Submit"];

function Shipment() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1
    portOfEntry: "",
    arrivalDate: "",
    carrierName: "",
    weight: "",
    description: "",
    // Step 2
    category: "",
    productName: "",
    quantity: "",
    categoryFields: {}, // dynamic, keyed by field name
    // Step 3
    documents: {
      invoice: null,
      certificateOfOrigin: null,
      categoryDoc: null,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      categoryFields: { ...prev.categoryFields, [name]: value },
    }));
  };

  const handleFileChange = (docKey) => (e) => {
    const file = e.target.files[0] || null;
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docKey]: file },
    }));
  };

  // When category changes, reset categoryFields so old category's data doesn't linger
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      category: value,
      categoryFields: {},
      documents: { ...prev.documents, categoryDoc: null },
    }));
  };

  const goNext = (e) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const goBack = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token"); // wherever you store it after login

  try {
    const response = await fetch("http://localhost:5000/api/shipment/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_name: formData.productName,
        product_category: formData.category,
        quantity: formData.quantity,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Submission failed");
      return;
    }

    alert(result.massege || "Shipment submitted!");

  } catch (err) {
    console.error("Error submitting shipment:", err);
    toast.error("Something went wrong submitting the shipment.");
  }
};

  const activeFields = CATEGORY_FIELDS[formData.category] || [];
  const categoryDocLabel = CATEGORY_DOC_LABEL[formData.category] || "Category Document";

  return (
    <div className="shipment-page">
      {/* ================= NAVBAR ================= */}
      <header className="top-navbar">
        <div className="portal-logo">
          <img src="./images/sqcc-logo.jpeg" alt="SQCC" />
        </div>

        <nav className="navbar-links">
          <a href="/shipments" className="active">Shipments</a>
          <a href="/certificates">Certificates</a>
          <a href="/invoices">Invoices</a>
        </nav>

        <div className="navbar-actions">
          <button className="new-submission-btn">New Submission</button>
          <button className="icon-btn"><RiNotification3Fill size={18} /></button>
          <button className="icon-btn"><GiHelp size={18} /></button>
          <div className="profile-circle">A</div>
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

        {/* ================= STEPS (now dynamic) ================= */}
        <div className="steps-container">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === step;
            const isDone = stepNum < step;
            return (
              <div key={label} style={{ display: "contents" }}>
                <div className={`step-item ${isActive ? "active-step" : ""} ${isDone ? "done-step" : ""}`}>
                  <div className="step-circle">{isDone ? "✓" : stepNum}</div>
                  <span>{label}</span>
                </div>
                {stepNum !== STEP_LABELS.length && <div className="step-line"></div>}
              </div>
            );
          })}
        </div>

        {/* ================= FORM CARD ================= */}
        <form
          className="shipment-card"
          onSubmit={step === 4 ? handleSubmit : goNext}
        >
          <div className="card-content">

            {/* ---------- STEP 1: Shipment Info ---------- */}
            {step === 1 && (
              <>
                <h2>Step 1: General Shipment Information</h2>
                <div className="divider"></div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Port of Entry <span>*</span></label>
                    <select name="portOfEntry" value={formData.portOfEntry} onChange={handleChange} required>
                      <option value="">Select Entry Port</option>
                      <option value="Berbera">Berbera Port</option>
                      <option value="Cigaal">Cigaal International Airport</option>
                      <option value="Wajaale">Wajaale</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Date of Arrival <span>*</span></label>
                    <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Carrier Name / Vessel</label>
                    <input type="text" name="carrierName" value={formData.carrierName} onChange={handleChange} placeholder="e.g. MSC Berbera V2" />
                  </div>

                  <div className="form-group">
                    <label>Total Weight (Metric Tons)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
                  </div>
                </div>

                <div className="form-group description-group">
                  <label>Brief Shipment Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="General description of goods being imported..." />
                </div>
              </>
            )}

            {/* ---------- STEP 2: Product Details ---------- */}
            {step === 2 && (
              <>
                <h2>Step 2: Product Details</h2>
                <div className="divider"></div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Category <span>*</span></label>
                    <select name="category" value={formData.category} onChange={handleCategoryChange} required>
                      <option value="">Select Category</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Food">Food</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Cosmetics">Cosmetics</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Product Name <span>*</span></label>
                    <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" required />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Quantity <span>*</span></label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 500" min="0" required />
                  </div>
                  <div className="form-group"></div>
                </div>

                {/* Dynamic fields based on chosen category */}
                {activeFields.length > 0 && (
                  <>
                    <div className="divider"></div>
                    <div className="form-grid">
                      {activeFields.map((f) => (
                        <div className="form-group" key={f.name}>
                          <label>{f.label} <span>*</span></label>
                          <input
                            type={f.type}
                            name={f.name}
                            placeholder={f.placeholder || ""}
                            value={formData.categoryFields[f.name] || ""}
                            onChange={handleCategoryFieldChange}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {!formData.category && (
                  <p className="helper-text">Select a category above to see the required fields for it.</p>
                )}
              </>
            )}

            {/* ---------- STEP 3: Document Upload ---------- */}
            {step === 3 && (
              <>
                <h2>Step 3: Document Upload</h2>
                <div className="divider"></div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Supplier Invoice <span>*</span></label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange("invoice")} required />
                  </div>

                  <div className="form-group">
                    <label>Certificate of Origin <span>*</span></label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange("certificateOfOrigin")} required />
                  </div>
                </div>

                {formData.category && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{categoryDocLabel} <span>*</span></label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange("categoryDoc")} required />
                    </div>
                    <div className="form-group"></div>
                  </div>
                )}
              </>
            )}

            {/* ---------- STEP 4: Review & Submit ---------- */}
            {step === 4 && (
              <>
                <h2>Step 4: Review & Submit</h2>
                <div className="divider"></div>

                <div className="review-section">
                  <h3>Shipment Info</h3>
                  <p><strong>Port of Entry:</strong> {formData.portOfEntry || "—"}</p>
                  <p><strong>Arrival Date:</strong> {formData.arrivalDate || "—"}</p>
                  <p><strong>Carrier:</strong> {formData.carrierName || "—"}</p>
                  <p><strong>Weight:</strong> {formData.weight || "—"} MT</p>
                  <p><strong>Description:</strong> {formData.description || "—"}</p>
                </div>

                <div className="review-section">
                  <h3>Product Details</h3>
                  <p><strong>Category:</strong> {formData.category || "—"}</p>
                  <p><strong>Product Name:</strong> {formData.productName || "—"}</p>
                  <p><strong>Quantity:</strong> {formData.quantity || "—"}</p>
                  {Object.entries(formData.categoryFields).map(([key, val]) => (
                    <p key={key}><strong>{key}:</strong> {val || "—"}</p>
                  ))}
                </div>

                <div className="review-section">
                  <h3>Documents</h3>
                  <p><strong>Invoice:</strong> {formData.documents.invoice?.name || "Not uploaded"}</p>
                  <p><strong>Certificate of Origin:</strong> {formData.documents.certificateOfOrigin?.name || "Not uploaded"}</p>
                  <p><strong>{categoryDocLabel}:</strong> {formData.documents.categoryDoc?.name || "Not uploaded"}</p>
                </div>
              </>
            )}

          </div>

          {/* ================= CARD FOOTER ================= */}
          <div className="card-footer">
            <button type="button" className="cancel-btn">
              <GiCancel size={19} />
            </button>

            <div style={{ display: "flex", gap: "12px" }}>
              {step > 1 && (
                <button type="button" className="cancel-btn" onClick={goBack}>
                  ← Back
                </button>
              )}

              <button type="submit" className="next-btn">
                {step < 4 ? (
                  <>
                    <FcNext size={15} />
                    <span>→</span>
                  </>
                ) : (
                  "Submit Shipment"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="site-footer">
        <strong>© 2024 Somaliland Quality Control Commission. All Rights Reserved.</strong>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/standards">Regulatory Standards</a>
        </div>
      </footer>
    </div>
  );
}

export default Shipment;
































































































//  Added New Steps like product details and document types
 // import { useState } from "react";
// import "./shipment.css"
// import { RiNotification3Fill } from "react-icons/ri";
// import { GiCancel, GiHelp } from "react-icons/gi";
// import { FcNext } from "react-icons/fc";

// function Shipment() {
//   const [formData, setFormData] = useState({
//     portOfEntry: "",
//     arrivalDate: "",
//     carrierName: "",
//     weight: "",
//     description: "",
//   });
//   const Category_feilds ={
//     Medicine:[
//       {name:"batch number",label:"Batch Number",type:"text",placeholder:"e.g BX-2291"},
//       {name:"expiryDate",label:"Expiry Date",type:"date",placeholder:"e.g BX-2291"},
//       {name:"manufacturer",label:"Manufactuture",type:"text",placeholder:"e.g Pfizer"},
//     ],
//     Food:[
//       {name:"expiryDate",label:"Expiry Date",type:"date"},
//       {name:"Orgin Health Certificate",label:"Health Certificate",type:"text",placeholder:"HC-2888"},
      
//     ],
//     Electronic:[
//       {name:"ComplianceCert",label:"Compliance Cert",type:"text",placeholder:"e.g.CE4471"}
//     ],
//     Cosmetics:[
//       {name:"expiryDate",label:"Expiry Date",type:"date"},
//       {name:"ingredientList",label:"Key Ingredients",type:"text",placeholder:"e.g.water,Glaycerin..."}
//     ]
//   }
//   const CATEGORY_DOC_LABEL = {
//    Medcine:"Certificate Of anlysis(CoA),Certifcate Of Orgin, packing list,Bill of landing/Air way Bill",
//    Food:"Health/Safety Certificate",
//    Elctronics:"Compliance Certificate",
//    Cosmetics:"Ingrdient Safety Data Sheet"
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleNext = (e) => {
//     e.preventDefault();

//     console.log("Shipment information:", formData);

//     // Later:
//     // move to Step 2
//   };

//   return (
//     <div className="shipment-page">

//       {/* ================= NAVBAR ================= */}
//       <header className="top-navbar">

//         <div className="portal-logo">
//           <img src="./images/sqcc-logo.jpeg"/>
//         </div>

//         <nav className="navbar-links">
//           {/* <a href="/impt-dash">Dashboard</a> */}

//           <a
//             href="/shipments"
//             className="active"
//           >
//             Shipments
//           </a>

//           <a href="/certificates">Certificates</a>

//           <a href="/invoices">Invoices</a>
//         </nav>

//         <div className="navbar-actions">

//           <button className="new-submission-btn">
//             New Submission
//           </button>

//           <button className="icon-btn">
//            <RiNotification3Fill size={18}/>
//           </button>

//           <button className="icon-btn">
//             <GiHelp size={18}/>
//           </button>

//           <div className="profile-circle">
//             A
//           </div>

//         </div>
//       </header>


//       {/* ================= MAIN ================= */}
//       <main className="shipment-container">

//         <section className="shipment-header">

//           <h1>New Shipment Submission</h1>

//           <p>
//             Please provide the initial details for your incoming shipment
//             to begin the quality control process.
//           </p>

//         </section>


//         {/* ================= STEPS ================= */}
//         <div className="steps-container">

//           <div className="step-item active-step">

//             <div className="step-circle">
//               1
//             </div>

//             <span>
//               Shipment Info
//             </span>

//           </div>


//           <div className="step-line"></div>


//           <div className="step-item">

//             <div className="step-circle">
//               2
//             </div>

//             <span>
//               Product Details
//             </span>

//           </div>


//           <div className="step-line"></div>


//           <div className="step-item">

//             <div className="step-circle">
//               3
//             </div>

//             <span>
//               Document Upload
//             </span>

//           </div>


//           <div className="step-line"></div>


//           <div className="step-item">

//             <div className="step-circle">
//               4
//             </div>

//             <span>
//               Review & Submit
//             </span>

//           </div>

//         </div>


//         {/* ================= FORM CARD ================= */}
//         <form
//           className="shipment-card"
//           onSubmit={handleNext}
//         >

//           <div className="card-content">

//             <h2>
//               Step 1: General Shipment Information
//             </h2>

//             <div className="divider"></div>


//             {/* ROW 1 */}
//             <div className="form-grid">

//               <div className="form-group">

//                 <label>
//                   Port of Entry <span>*</span>
//                 </label>

//                 <select
//                   name="portOfEntry"
//                   value={formData.portOfEntry}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">
//                     Select Entry Port
//                   </option>

//                   <option value="Berbera">
//                     Berbera Port
//                   </option>

//                   <option value="Hargeisa">
//                     Hargeisa Airport
//                   </option>

//                   <option value="Wajaale">
//                     Wajaale
//                   </option>

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label>
//                   Estimated Date of Arrival <span>*</span>
//                 </label>

//                 <input
//                   type="date"
//                   name="arrivalDate"
//                   value={formData.arrivalDate}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//             </div>


//             {/* ROW 2 */}
//             <div className="form-grid">

//               <div className="form-group">

//                 <label>
//                   Carrier Name / Vessel
//                 </label>

//                 <input
//                   type="text"
//                   name="carrierName"
//                   value={formData.carrierName}
//                   onChange={handleChange}
//                   placeholder="e.g. MSC Berbera V2"
//                 />

//               </div>


//               <div className="form-group">

//                 <label>
//                   Total Weight (Metric Tons)
//                 </label>

//                 <input
//                   type="number"
//                   name="weight"
//                   value={formData.weight}
//                   onChange={handleChange}
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                 />

//               </div>

//             </div>


//             {/* DESCRIPTION */}
//             <div className="form-group description-group">

//               <label>
//                 Brief Shipment Description
//               </label>

//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="General description of goods being imported..."
//               />

//             </div>

//           </div>


//           {/* ================= CARD FOOTER ================= */}
//           <div className="card-footer">

//             <button
//               type="button"
//               className="cancel-btn"
//             >
//               <GiCancel size={19}/>
//             </button>

//             <button
//               type="submit"
//               className="next-btn"
//             >
//                <FcNext size={15}/>
//               <span>Next</span>
//             </button>

//           </div>

//         </form>

//       </main>


//       {/* ================= FOOTER ================= */}
//       <footer className="site-footer">

//         <strong>
//           © 2024 Somaliland Quality Control Commission.
//           All Rights Reserved.
//         </strong>

//         <div className="footer-links">

//           <a href="/privacy">
//             Privacy Policy
//           </a>

//           <a href="/terms">
//             Terms of Service
//           </a>

//           <a href="/standards">
//             Regulatory Standards
//           </a>

//         </div>

//       </footer>

//     </div>
//   );
// }

// export default Shipment;







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