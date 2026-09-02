import	axios	from	"axios";
const	API_URL	=	import.meta.env.VITE_API_URL	||	"http://localhost:5000/api";
//	GET	/api/images
export	async	function	fetchImages()	{
		const	res	=	await	axios.get(`${API_URL}/images`);
		return	res.data;
}
//	POST	/api/images		(multipart/form-data)
export	async	function	uploadImage(file)	{
		const	formData	=	new	FormData();
		//	Field	name	must	match	upload.single("image")	on	the	server.
		formData.append("image",	file);
		const	res	=	await	axios.post(`${API_URL}/images`,	formData);
		//	Note:	we	do	NOT	set	the	Content-Type	header	manually	—	the	browser
		//	adds	multipart/form-data	with	the	correct	boundary	automatically.
		return	res.data;
}
//	DELETE	/api/images/:id
export	async	function	deleteImage(id)	{
		const	res	=	await	axios.delete(`${API_URL}/images/${id}`);
		return	res.data;
}