// import { useState } from "react";

// import { makeStyles } from "@material-ui/core/styles";
// import { TableBody, TableCell, TableRow, Radio } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({
//   formats: {
//     display: "flex",
//     justifyContent: "center",
//   },
// }));

// const Table = () => {
//   const [selectedFormatId, setSelectedFormatId] = useState("");

//   const handleSelect = (ev) => {
//     const formatId = ev.target.id;

//     setSelectedFormatId(formatId);
//   };

//   const renderFormats = formats
//     .filter(
//       (format) =>
//         format.acodec !== "none" && !format.format.includes("audio only")
//     )
//     .map((item, index) => {
//       return (
//         <TableRow key={index}>
//           <TableCell>
//             <Radio
//               onClick={handleSelect}
//               size="small"
//               id={item.format_id}
//               checked={selectedFormatId === item.format_id}
//             />
//           </TableCell>
//           <TableCell id="extension"> {item.ext} </TableCell>
//           <TableCell id="size"> {`${item.filesize} MB`} </TableCell>
//           <TableCell id="resolution"> {item.format_note} </TableCell>
//         </TableRow>
//       );
//     });

//   const classes = useStyles();
//   return (
//     <div className={classes.formats}>
//       <TableBody>{renderFormats}</TableBody>
//     </div>
//   );
// };

// export default Table;
