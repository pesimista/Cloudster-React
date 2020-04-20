import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
//import { Grow, Paper, makeStyles, MenuItem, Popper, ClickAwayListener, MenuList } from '@material-ui/core';
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useHistory } from "react-router-dom";
import { getIcon } from "../SF/helpers";

const useStyles = makeStyles(theme => ({
	popper: { zIndex: 10000 },
	text: { color: "white" },
	image: { width: 164, height: 164 },
	paper: {
		margin: theme.spacing(1),
		backgroundColor: "inherit"
	},
	paperMod: {
		padding: theme.spacing(2),
		margin: "auto", maxWidth: 700
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
}));

const initialState = {
	open: false,
	openModal: false
};

const reducer = (state, action) => {
	return { ...state, ...action };
};

const Files = ({file: { ino, name, ext, isFile, lastChanged, size, nivel }, ...props}) => {
	const classes = useStyles();
	const history = useHistory();

	const [state, update] = React.useReducer(reducer, initialState);
	// const { state: globalState, dispatch } = useContext(saduwux);

	const { index, updateFolder, updatePlayer } = props;
	const anchorRef = React.useRef(null);
	const prevOpen = React.useRef(state.open);

	React.useEffect(() => {
		if (prevOpen.current && !state.open) {
			anchorRef.current.focus();
		}
		prevOpen.current = state.open;
	}, [state.open]);

	const handleToggle = () => {
		update({ open: !state.open });
	};

	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		update({ open: false });
	};
	const handleOpenModal = () => {
		update({
			open: false,
			openModal: true
		});
	};

	const handleCloseModal = () => {
		update({ openModal: false });
		// setOpenModal(false);
	};

	const modRep = id => {
		updatePlayer(id);
		history.push("/reproductor");
	}; //changeRep

	const download = ino => {
		fetch(`/api/files/${ino}/download`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token")
			}
		});
	};

	const handleListKeyDown = (event) => {
		if (event.index === "Tab") {
			event.preventDefault();
			update({ open: true });
		}
	}

	const content = (
		<Grow
			key={index}
			in
			style={{ transformOrigin: "0 0 0" }}
			{...{ timeout:  index * 100 }}
		>
			<Paper color="primary" elevation={0} className={classes.paper}>
				<React.Fragment>
					<img src={getIcon(isFile, ext)} alt={ext} />
					<Typography
						variant="body2"
						className={props.useTheme ? classes.text : ""}
						style={{ overflowWrap: "break-word" }}
					>
						{name.length > 30
							? name.substring(0, 27) + "..." + ext
							: name}
					</Typography>
				</React.Fragment>
			</Paper>
		</Grow>
	);

	if (!isFile) {
		return (
			<Box
				onClick={() => updateFolder(ino)}
				onContextMenu={e => e.preventDefault()}
				textAlign="center"
				width={80}
				style={{ margin: "0px 5px 10px", cursor: "pointer" }}
			>
				{content}
			</Box>
		);
	} else {
		return (
			<Box
				textAlign="center"
				width={80}
				style={{ margin: "0px 5px 10px", cursor: "pointer" }}
			>
				{/* eslint-disable-next-line */}
				<a
					ref={anchorRef}
					aria-controls={state.open ? "menu-list-grow" : undefined}
					aria-haspopup="true"
					onClick={handleToggle}
					onContextMenu={e => e.preventDefault()}
				>
					{content}
				</a>
				<Popper
					className={classes.popper}
					open={state.open}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === "bottom"
										? "center top"
										: "center bottom"
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										autoFocusItem={state.open}
										id="menu-list-grow"
										onKeyDown={handleListKeyDown}
									>
										<MenuItem onClick={() => download(ino)}>
											Descargar
                              </MenuItem>
										<MenuItem onClick={() => modRep(ino)}>
											Reproducir
                              </MenuItem>
										<MenuItem onClick={handleOpenModal}>
											Información
                              </MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={state.openModal}
					className={classes.modal}
					onClose={handleCloseModal}
				>
					{/*-------------------------GRID----------------------------*/}
					<Paper className={classes.paperMod}>
						<Grid container spacing={2}>
							<Grid item>
								<div className={classes.image}>
									<img
										src={getIcon(isFile, ext)}
										alt={ext}
										width="164"
										height="164"
									/>
								</div>
							</Grid>
							<Grid item xs={12} sm container>
								<Grid item xs container direction="row" spacing={2}>
									<Grid item xs={12}>
										<Typography variant="body2" color="textSecondary">
											Nombre:
                              			</Typography>
										<Typography gutterBottom variant="subtitle1">
											{name}
										</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant="body2" color="textSecondary">
											Extensión:
                              			</Typography>
										<Typography gutterBottom variant="subtitle1">
											{ext}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											Última modificación:
                              			</Typography>
										<Typography gutterBottom variant="subtitle1">
											{lastChanged}
										</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant="body2" color="textSecondary">
											Tamaño:
                              			</Typography>
										<Typography gutterBottom variant="subtitle1">
											{size}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											Nivel
                              			</Typography>
										<Typography gutterBottom variant="subtitle1">
											{nivel}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Modal>
			</Box>
		);
	}
};

export default Files;
