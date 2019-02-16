---
date: 2018-02-16
layout: post
title: Dealing with SOAP in clojure
categories: Tech,Clojure,SOAP
type: post
published: true
meta-robots: noodp,noydir
meta-description: Dealing with SOAP in clojure is not very straight-forward due to the lack of framework support. This post explains how to perform SOAP call using basic Java libraries.
meta-keywords: clojure, soap, tech, saaj, compojure
---
### Simple Object Access Protocol (SOAP)

SOAP brings its own protocol and focuses on exposing pieces of application logic (not data) as services. SOAP is focused on accessing named operations, each implements some business logic through different interfaces. This image below expresses the difference between a SOAP and normal REST/JSON endpoint very well.

![SOAP explanation](/assets/images/posts/soap-clj/soap-primer.png)

Source: [Stack overflow](https://stackoverflow.com/a/44713574/419448)

### Soap With Attachment API for Java (SAAJ)

[SAAJ](https://docs.oracle.com/javaee/5/tutorial/doc/bnbhg.html) is a lower level API in Java that express SOAP messages. Java developers rarely use SAAJ since the JAX WS and Spring WS provides better abstraction over SAAJ.

### SOAP in Clojure

#### 1\. Prerequisite

As a one-time step, convert the WSDL into Java objects. This can be done using \`wsimport\` or \`xjc\`

xjc -wsdl wsdl-file-name

or

wsimport wsdl-file-name

#### 2\. Build SOAP Message

First step is to build a soap message with header and body. The root element of the SOAP body is one of the Java object created in the first step. Construct the Java object with the necessary data. Finally convert the SOAP Message into string.

#### 3\. Perform POST

A simple HTTP POST need to be performed with Content-Type header set to text/xml. This can be done using normal clj-http methods.Authentication should be covered ideally in the SOAP header.

#### 4\. Parse response into Java Object

Finally the response string has to be converted into a SOAP Message again. This is required to parse the SOAP Response Body into one of the generated object.

### Code in action

Here is my [Github repository](https://github.com/prasann/soap-clj) with a small working application.