import "./style.css";

import { Col, Container, Row } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, projectportfolio } from "../../content_option";


import React from "react";
import paper from "../../assets/project/paper.gif";
import interview from "../../assets/project/interview.png";



const imgMap = {
  paper: paper,
  interview: interview,
  dcd

};

export const Projects = () => {


  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Projects | {meta.title} </title>{" "}
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h3>👩‍💻 Software Tools & Projects </h3>{" "}
          </Col>
        </Row>
        <div className="">
          {projectportfolio.map((data, i) => {
            return (
              <div key={i} className="researchBox">
                <div>
                  <img className="img_research" src={imgMap[data.img]} alt={data.title}></img>
                </div>
                <div className="description">
                  <h5>{data.title}</h5>
                  <div>
                    <p>{data.description}</p>
                    {[
                      data.github && <a className="d" href={data.github}>github</a>,
                      data.website && <a className="d" href={data.website}>website</a>,
                      data.paper && <a className="d" href={data.paper}>paper</a>,
                      data.project && <a className="d" href={data.project}>Project</a>,
                      data.notes && <span className="d">{data.notes}</span>,
                      data.code && <span className="d">{data.code}</span>
                    ].filter(Boolean).map((item, index, array) => (
                      <React.Fragment key={index}>
                        {item}
                        {index < array.length - 1 && ' | '}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </HelmetProvider>
  );
};
