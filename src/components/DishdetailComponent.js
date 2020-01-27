import React, { Component } from 'react'; 
import {Card, CardImg, CardText, CardBody, CardTitle, BreadcrumbItem, Breadcrumb, Button, Modal, ModalHeader, ModalBody, Label, Row, } from 'reactstrap'; 
import { Link } from 'react-router-dom'; 
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading  } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderDish({dish}) { 
	return( <div className='col-12 com-md-5 m-1'> <Card> 
			<CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} /> 
			<CardBody> <CardTitle>{dish.name}</CardTitle> 
				<CardText>{dish.description}</CardText> 
			</CardBody> 
		</Card> 
	</div>); } 

class CommentForm extends Component { 

	constructor(props) { 
		super(props); 
		this.state = { 
			isModalOpen: false
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

	handleSubmit(values) {
		this.toggleModal();
		this.props.postComment(this.props.dishId, values.rating, values.author, values.comment)
	}

	render() {
		return(
			<div>
				<Button outline onClick={this.toggleModal} >
					<span className="fa fa-pencil fa-lg"></span> Submit Comment
				</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit comment</ModalHeader>
					<ModalBody>
						<div className="col-12">
							<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
								<Row className="form-group">
									<Label htmlFor="rating">Rating</Label> 
									<Control.select model=".rating" id="rating" name="rating" 
										className="form-control" md={2}>
										<option>1</option> 
										<option>2</option> 
										<option>3</option> 
										<option>4</option> 
										<option>5</option> 
									</Control.select> 
								</Row> 
								<Row className="form-group">
									<Label htmlFor="author">Your Name</Label> 
									<Control.text model=".author" id="author" name="author" 
										placeholder='Your Name'
										className="form-control"
										validators={{
											required, minLength: minLength(3), maxLength: maxLength(15)
										}}
									/>
									<Errors
										className="text-danger"
										model=".name"
										show="touched"
										messages={{
											required: 'Required',
											minLength: 'Must be greater than 2 characters',
											maxLength: 'Must be 15 characters or less'
										}}
									/>
								</Row>
								<Row className="form-group">
									<Label for="comment">Comment</Label>
									<Control.textarea model=".comment" name="comment" id="comment"
										rows="6"
										className="form-control" />
								</Row>
								<Button type="submit" color="primary" >Submit</Button>
							</LocalForm>
						</div>
					</ModalBody>
				</Modal>
			</div>
		)
	} 
}


function RenderComments({comments, postComment, dishId}) {
	if (comments != null) 
		return(
			<div className="col-12 m-1">
				<h4>Comments</h4>
				<ul className="list-unstyled">
					{comments.map((comment) => {
						return (
							<li key={comment.id}>
								<p>{comment.comment}</p>
								<p>--{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>                           
							</li>
						);
					})}
				</ul>
				<CommentForm dishId={dishId} postComment={postComment} />
			</div>
		);
	else {
		return (
			<div></div>
		);
	}
}


const DishDetail =(props) => {

	if (props.isLoading) {
		return(
			<div className="container">
				<div className="row">            
					<Loading />
				</div>
			</div>

		);
	}
	else if (props.errMess) {
		return(
			<div className="container">
				<div className="row">            
					<h4>{props.errMess}</h4>
				</div>
			</div>

		);
	}
	else if (props.dish != null) 
		return(
			<div className="container">
				<div className="row">
					<Breadcrumb>
						<BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
						<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className="col-12">
						<h3>{props.dish.name}</h3>
						<hr />
					</div>                
				</div>
				<div className="row">
					<div className="col-12 col-md-5 m-1">
						<RenderDish dish={props.dish} />
					</div>
					<div className="col-12 col-md-5 m-1">
						<RenderComments comments={props.comments} 
							postComment={props.postComment}
							dishId={props.dish.id} />
					</div>
				</div>
			</div>
		);
	else
		return(
			<div></div>
		);
}

export default DishDetail;

