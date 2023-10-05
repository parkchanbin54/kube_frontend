import React, { useEffect } from 'react'
import { useState, Fragment } from 'react'
import { useNavigate, useParams,useLocation} from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ForwardIcon, TrashIcon,ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { useSelector,useDispatch } from 'react-redux';
import { set } from 'date-fns';


function FileListItem(props){

    const {item}=props;
    
    function downloadPDF(item) {
        const linkSource = `data:application/pdf;base64,${item.base64}`;
        console.log("linkSource",linkSource);
        const downloadLink = document.createElement('a');
        const fileName = item.name;
    
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }
    
    return(
        <div>
            <p onClick={()=>{
                downloadPDF(item);
            }}>{item.name}</p>
        </div>
    );
}

export default FileListItem