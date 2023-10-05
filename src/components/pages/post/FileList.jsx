import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import FileListItem from "./FileListItem";


function FileList(props) {
    const {items}=props;

    return (
      <div class="flex-col h-40 overflow-auto border-4 my-3 border-indigo-100">
        
        {items && items.map((item,idx)=>{
            console.log("item",item);
            
                return(
                <FileListItem
                    key={idx}
                    item={item}/>
                );
          })}
       
          
        </div>
    );
    
}

export default FileList;