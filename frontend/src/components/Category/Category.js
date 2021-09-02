import React, { Component, useState, useEffect } from "react";
import { Grommet, Box, Grid } from "grommet";
import { Heading } from "grommet";

import classes from './Category.module.css';
import { Sidebar } from "grommet";
import CategoryItem from "./CategoryItem";
import API from "../../utils/api";



const Category= ({categoryList, category_chg})=> {
	const [jobs , setJobs] = useState([]);
  const [error, setError] = useState(null);
	const [checkedItems, setCheckedItems] = useState([
		{
			id: 1,
			category: 'techStack',
			set: new Set()
		},
		{
			id: 2,
			category: 'enterTp',
			set: new Set()
		},
		{
			id: 3,
			category: 'region',
			set: new Set()
		},
		{
			id: 4,
			category: 'salary',
			set: new Set()
		},
		{
			id: 5,
			category: 'edubgIcd',
			set: new Set()
		}
	]);

	function apiPostTag(){
		function apiSendTag(props){
			return Array.from(checkedItems.find(element => element.category === props).set);
		}

		return(
			API.patch(`/category/${category_chg}`, {
				tags: {
					techStack: apiSendTag('techStack'),
					enterTp: apiSendTag('enterTp'),
					salary: apiSendTag('salary'),
					region: apiSendTag('region'),
					edubgIcd: apiSendTag('edubgIcd'),
				}			
			}).then(res => {
				console.log(res.status);
			  })
			  .catch(error => {
				if (error.response.status === 404) {
				  console.error(error);
				}
			  })
		);
	}

	const checkedItemHandler = async(tag, cat, isChecked) => {
		const k = checkedItems.find(element => element.category === cat);
		if(isChecked){
			k.set.add(tag);
			setCheckedItems(checkedItems);
			await apiPostTag();
		}		
		else if (!isChecked && k.set.has(tag)){
			k.set.delete(tag);
			setCheckedItems(checkedItems);
			await apiPostTag();
		}
	}

	return (
		<ul className={classes.categoryWrapper}>
			
			{categoryList.map(item =>
				<CategoryItem
					key={item.id}
					category={item.id}
					title = {item.title}
					tag={item.tag}
					checkedItemHandler={checkedItemHandler}
				/>
				)}
		</ul>
	);
}

export default Category;