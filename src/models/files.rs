use std::path::PathBuf;
use crate::models::Method;
use serde::de::{self, Deserializer};
use serde::Deserialize;
use serde_yaml::Value;
use thiserror::Error;

#[derive(Debug, Deserialize)]
pub struct File {
    #[serde(default)]
    pub uri: String,
    #[serde(default)]
    pub headers: Vec<(String, String)>,
    #[serde(default)]
    pub params: Vec<(String, String)>,
    pub method: Method,
    #[serde(default)]
    pub body: Option<Value>,
    #[serde(default)]
    pub documentation: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct FileMetadata {
    runa: String,
    version: String,
    #[serde(deserialize_with = "deserialize_method")]
    method: Method,
    order: i16,
}

impl FileMetadata {
    /// Identificador/nombre mostrable del request en la UI (sidebar, pestañas, etc.).
    pub fn runa(&self) -> &str {
        &self.runa
    }

    pub fn method(&self) -> &Method {
        &self.method
    }

    /// Orden relativo dentro de la carpeta (metadatos Runa).
    pub fn display_order(&self) -> i16 {
        self.order
    }

    pub fn validate(&self) -> Result<(), MetadataError> {
        // if self.runa != "runa" {
        //     return Err(MetadataError::InvalidProject);
        // }

        if self.version != "1" {
            return Err(MetadataError::UnsupportedVersion);
        }
        Ok(())
    }
}
fn deserialize_method<'de, D>(deserializer: D) -> Result<Method, D::Error>
where
    D: Deserializer<'de>,
{
    let m: Method = Method::deserialize(deserializer)
        .map_err(|_| de::Error::custom("Unsupported method"))?;
    Ok(m)
}

#[derive(Debug, Error)]
pub enum MetadataError {
    #[error("Invalid metadata")]
    InvalidMetadata,
    #[error("Invalid project")]
    InvalidProject,
    #[error("Unsupported Runa Version")]
    UnsupportedVersion,
    #[error("Wrong format")]
    WrongFormat,
    #[error("Unsupported method")]
    WrongMethod,

}

#[derive(Debug)]
pub struct Tree {
    root: PathBuf,
    files: Vec<Node>,
}

#[derive(Debug)]
pub struct Node {
    parent: Option<usize>,
    children: Vec<usize>,
    metadata: Option<FileMetadata>,
    filename: String,
    node_type: NodeType,
}

impl Node {
    pub fn filename(&self) -> &str {
        &self.filename
    }

    pub fn parent(&self) -> Option<usize> {
        self.parent
    }

    pub fn children(&self) -> &[usize] {
        &self.children
    }

    pub fn node_type(&self) -> &NodeType {
        &self.node_type
    }

    /// Metadatos Runa del archivo (solo nodos `File` válidos).
    pub fn metadata(&self) -> Option<&FileMetadata> {
        self.metadata.as_ref()
    }

    /// Texto del método HTTP para la UI, o cadena vacía en directorios.
    pub fn method_label(&self) -> &'static str {
        self.metadata
            .as_ref()
            .map(|m| m.method().as_str())
            .unwrap_or("")
    }
}

#[derive(Debug)]
pub enum NodeType {
    Directory,
    File
}

impl Tree {
    pub fn new (root: PathBuf) -> Self {
        Self {
            root, files: Vec::new()
        }
    }

    /// Ruta raíz del proyecto Runa (directorio con `.runa`).
    pub fn root_path(&self) -> &PathBuf {
        &self.root
    }

    /// Todos los nodos del árbol (índice = id interno).
    pub fn nodes(&self) -> &[Node] {
        &self.files
    }

    pub fn node(&self, idx: usize) -> Option<&Node> {
        self.files.get(idx)
    }

    /// Índices de nodos sin padre (raíces del bosque).
    pub fn root_indices(&self) -> impl Iterator<Item = usize> + '_ {
        self.files
            .iter()
            .enumerate()
            .filter(|(_, n)| n.parent.is_none())
            .map(|(i, _)| i)
    }

    pub fn add_node (&mut self, parent: Option<usize>, filename: String, node_type: NodeType, metadata: Option<FileMetadata>) -> usize {

        let idx = self.files.len();
        self.files.push(Node {
            parent,
            filename,
            node_type,
            metadata,
            children: Vec::new(),
        });
        if let Some(parent_idx) = parent {
            self.files[parent_idx].children.push(idx);
        }
        idx
    }

    /// Ruta relativa al directorio raíz del proyecto (segmentos con `/`), solo para nodos `File`.
    pub fn node_relative_path(&self, idx: usize) -> Option<String> {
        let node = self.node(idx)?;
        if !matches!(node.node_type(), NodeType::File) {
            return None;
        }
        let mut parts: Vec<&str> = Vec::new();
        let mut cur = Some(idx);
        while let Some(i) = cur {
            let n = self.node(i)?;
            parts.push(n.filename());
            cur = n.parent();
        }
        parts.reverse();
        Some(parts.join("/"))
    }
}