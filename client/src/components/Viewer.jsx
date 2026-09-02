import	{	useEffect,	useCallback	}	from	"react";
export	default	function	Viewer({	images,	currentIndex,	onClose,	onNavigate,	onDelete	})	{
		const	total	=	images.length;
		const	current	=	images[currentIndex];
		const	goNext	=	useCallback(()	=>	{
				onNavigate((currentIndex	+	1)	%	total);
		},	[currentIndex,	total,	onNavigate]);
		const	goPrev	=	useCallback(()	=>	{
				onNavigate((currentIndex	-	1	+	total)	%	total);
		},	[currentIndex,	total,	onNavigate]);
		//	Close	on	Escape,	navigate	with	arrow	keys.
		useEffect(()	=>	{
				function	handleKeyDown(e)	{
						if	(e.key	===	"Escape")	onClose();
						if	(e.key	===	"ArrowRight")	goNext();
						if	(e.key	===	"ArrowLeft")	goPrev();
				}
				window.addEventListener("keydown",	handleKeyDown);
				return	()	=>	window.removeEventListener("keydown",	handleKeyDown);
		},	[onClose,	goNext,	goPrev]);
		if	(!current)	return	null;
		const	filename	=	current.imageUrl.split("/uploads/")[1]	||	"image";
		return	(
				<div	className="viewer-backdrop"	onClick={onClose}>
						<div	className="viewer-modal"	onClick={(e)	=>	e.stopPropagation()}>
								<button	className="viewer-close"	onClick={onClose}	aria-label="Close	viewer">
										×
								</button>
								<button	className="viewer-nav	viewer-prev"	onClick={goPrev}	aria-label="Previous	image">
										‹
								</button>
			<img	src={current.imageUrl}	alt={filename}	className="viewer-image"	/>
								<button	className="viewer-nav	viewer-next"	onClick={goNext}	aria-label="Next	image">
										›
								</button>
								<div	className="viewer-footer">
										<div>
												<div	className="viewer-filename">{filename}</div>
												<div	className="viewer-meta">
														Image	{currentIndex	+	1}	of	{total}	·	use	‹	Previous	/	Next	›	or	arrow	keys
												</div>
										</div>
										<button
												className="viewer-delete"
												onClick={()	=>	onDelete(current._id)}
										>
												Delete
										</button>
								</div>
								<div	className="viewer-dots">
										{images.map((_,	i)	=>	(
												<span
														key={i}
														className={`dot	${i	===	currentIndex	?	"active"	:	""}`}
														onClick={()	=>	onNavigate(i)}
												/>
										))}
								</div>
						</div>
				</div>
		);
    }