import styled from "styled-components";

export default function FileUpload(props) {
    return (
        <>
        <label className="input-file-button" for="input-file">
            업로드
        </label>
        <input type="file" id="input-file" style={{display:"none"}}/>
        </>
        
    )
}

