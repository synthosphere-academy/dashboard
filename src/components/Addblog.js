/* eslint-disable prettier/prettier */
import { useState, React } from 'react';
import {
    CCard,
    CFormInput,
    CCol,
    CRow,
    CForm,
    CFormLabel,
    CFormTextarea,
    CFormCheck, CButton
} from '@coreui/react';
import uploadpic from '../Image/upload.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Addblog = () => {
    const [blogtitle, setBlogtitle] = useState('');
    const [blogdescription , setBlogdescription] = useState('');
    const [image, setImage] = useState(null);


    const convertToBase64 = (file) => {
        console.log(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const data = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result)
            reader.onerror = (err) => {
                reject(err)
            }
        })
        return data;
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const image = await convertToBase64(file)
        setImage(image);
         console.log(image);
    };
    return (
        <CRow>
            <CCol xs={12} >
                <div className=' fw-bold mt-2 mb-3' style={{ fontSize: "25px" }}>Add new blog</div>
                <CCard className="mb-4 cardform">
                    <CForm className='mt-4 ms-4 mb-3' method="post" encType="multipart/form-data">
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <CFormLabel htmlFor="exampleFormControlInput1">Blog Title<sup><i className="fa fa-asterisk" style={{ fontSize: "9px" }}></i></sup></CFormLabel>
                                        </div>
                                        <div className='col-6 text-end'><i className="fa fa-edit ms-2 mt-2"></i><span className='ms-2  me-3 fw-bold'>Edit title</span></div>
                                    </div>

                                    <CFormInput
                                        type="text"
                                        id="exampleFormControlInput1"
                                        name="blogtitle"
                                        placeholder="Enter Blog title"
                                        onChange={e => setBlogtitle(e.target.value)}
                                    />

                                </div>
                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <CFormLabel htmlFor="exampleFormControlInput1">Blog description<sup><i className="fa fa-asterisk" style={{ fontSize: "9px" }}></i></sup></CFormLabel>
                                        </div>
                                        <div className='col-6 text-end'><i className="fa fa-edit ms-2 mt-2"></i><span className='ms-2  me-3 fw-bold'>Edit description</span></div>
                                    </div>
                                    <ReactQuill
                                            theme="snow" // Specify theme 
                                            name="blog_description" // Set editor content
                                            value={blogdescription}
                                            onChange={(value) => setBlogdescription(value)}
                                            
                                        />

                                    
                                </div>
                            </div>
                            <div className='col-lg-6'>
                            <div className="mb-3">
                                        <CFormLabel htmlFor="exampleFormControlInput5">Blog image<sup><i className="fa fa-asterisk" style={{ fontSize: "9px" }}></i></sup></CFormLabel>
                                        <CFormInput
                                            type="file"
                                            name='image'
                                            id="exampleFormControlInput5"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className='text-center' >
                                        {image ? <img width={400} height={300} src={image} /> : <img width={150} height={150} src={uploadpic} />}
                                    </div>

                            </div>

                        </div>
                    </CForm>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Addblog;