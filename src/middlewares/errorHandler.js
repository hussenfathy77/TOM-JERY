const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma unique constraint error (P2002) or PostgreSQL unique_violation (23505)
  if (err.code === 'P2002' || err.code === '23505') {
    const field = err.meta?.target?.[0] || (err.detail?.match(/\((.*?)\)/)?.[1]) || 'field';
    return res.status(409).json({
      error: `A record with this ${field} already exists`
    });
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found'
    });
  }

  // Prisma foreign key constraint (P2003)
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Invalid reference to related record'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message
  });
};

module.exports = errorHandler;
